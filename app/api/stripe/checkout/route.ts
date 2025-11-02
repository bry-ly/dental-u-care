import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Checkout request body:", body);

    const { appointmentData, amount } = body;

    if (
      !appointmentData ||
      amount === undefined ||
      amount === null ||
      amount <= 0
    ) {
      console.error("Missing or invalid appointmentData or amount:", {
        appointmentData: !!appointmentData,
        amount,
      });
      return NextResponse.json(
        { error: "Appointment data and valid amount (> 0) are required" },
        { status: 400 }
      );
    }

    console.log("Parsed data:", {
      appointmentDataKeys: Object.keys(appointmentData),
      amount,
    });

    // Get the session from headers
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      console.error("No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Session found for user:", session.user.email);

    // Create Stripe checkout session with the total amount
    console.log("Creating Stripe session with amount:", amount);

    // Create a minimal metadata object (Stripe has 500 char limit per field)
    // Store only essential data, full data will be in our database
    const minimalMetadata = {
      userId: session.user.id,
      patientId: appointmentData.patientId,
      dentistId: appointmentData.appointment.dentistId,
      dentistName: appointmentData.appointment.dentistName,
      date: appointmentData.appointment.date,
      time: appointmentData.appointment.time,
      amount: amount.toString(),
      serviceCount: appointmentData.services.length.toString(),
    };

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "php",
            product_data: {
              name: "Dental Appointment Booking",
              description: `Appointment with ${appointmentData.appointment.dentistName} on ${appointmentData.appointment.date} at ${appointmentData.appointment.time}`,
            },
            unit_amount: Math.round(amount), // Amount is already in cents/centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: session.user.email,
      metadata: minimalMetadata,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/appointments?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/book-appointment?canceled=true`,
    });

    console.log("Stripe session created:", {
      id: checkoutSession.id,
      url: checkoutSession.url,
    });

    console.log("Stripe session created:", {
      id: checkoutSession.id,
      url: checkoutSession.url,
    });

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error("Error creating checkout session", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
