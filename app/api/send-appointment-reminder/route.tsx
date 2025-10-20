import DentalAppointmentReminder from "@/components/emails/email-remainder";
import { Resend } from "resend";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  const {
    patientName,
    appointmentDate,
    appointmentTime,
    doctorName,
    treatmentType,
    duration,
    clinicPhone,
    clinicEmail,
    clinicAddress,
    to,
  } = body;

  try {
    const { data, error } = await resend.emails.send({
      from: `Dental U Care <${process.env.EMAIL_SENDER_ADDRESS || "onboarding@dentalucare.tech"}>`,
      to: [to],
      subject: `Dental Appointment Reminder for ${patientName}`,
      react: (
        <DentalAppointmentReminder
          patientName={patientName}
          appointmentDate={appointmentDate}
          appointmentTime={appointmentTime}
          doctorName={doctorName}
          treatmentType={treatmentType}
          duration={duration}
          clinicPhone={clinicPhone}
          clinicEmail={clinicEmail}
          clinicAddress={clinicAddress || ""}
        />
      ),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }
    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
