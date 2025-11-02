import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const sig = (await headers()).get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: unknown) {
      console.error(
        `Webhook signature verification failed.`,
        err instanceof Error ? err.message : String(err)
      );
      return NextResponse.json({ error: "Webhook error" }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  try {
    const userId = session.metadata?.userId;
    const appointmentDataString = session.metadata?.appointmentData;
    const amount = session.metadata?.amount;

    if (!userId || !appointmentDataString || !amount) {
      throw new Error("Missing required metadata");
    }

    const appointmentData = JSON.parse(appointmentDataString);

    // Find the service ID from the appointment data
    // For now, we'll use the first service, but this should be improved to handle multiple services
    const firstService = appointmentData.services[0];
    if (!firstService) {
      throw new Error("No services selected in appointment");
    }

    const service = await prisma.service.findFirst({
      where: {
        name: firstService.description,
      },
    });

    if (!service) {
      throw new Error(`Service not found: ${firstService.description}`);
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: appointmentData.patientId,
        dentistId: appointmentData.appointment.dentistId,
        serviceId: service.id,
        date: new Date(appointmentData.appointment.date),
        timeSlot: appointmentData.appointment.time,
        status: "confirmed",
        notes: appointmentData.specialRequests || "",
      },
    });

    // Create the payment record
    await prisma.payment.create({
      data: {
        appointmentId: appointment.id,
        userId: userId,
        amount: parseFloat(amount),
        method: "card",
        status: "paid",
        transactionId: session.id,
        stripeCustomerId: session.customer as string,
        stripePaymentIntentId: session.payment_intent as string,
        paidAt: new Date(),
      },
    });

    // Update user information if this is their first appointment
    await prisma.user.update({
      where: { id: userId },
      data: {
        phone: appointmentData.personalInfo.contactNumber,
        address: `${appointmentData.personalInfo.address}, ${appointmentData.personalInfo.city} ${appointmentData.personalInfo.postalCode}`,
        dateOfBirth: new Date(appointmentData.personalInfo.dateOfBirth),
        medicalHistory: JSON.stringify({
          conditions: appointmentData.medicalHistory.conditions,
          medications: appointmentData.medicalHistory.medications,
          allergies: appointmentData.medicalHistory.allergies,
        }),
        stripeCustomerId: session.customer as string,
      },
    });

    console.log("Appointment and payment created successfully");
  } catch (error) {
    console.error("Error handling checkout session completed:", error);
    throw error;
  }
}
