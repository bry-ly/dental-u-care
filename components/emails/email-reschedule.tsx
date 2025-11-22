import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Heading,
  Hr,
  Button,
  Tailwind,
} from "@react-email/components";

export interface AppointmentRescheduleProps {
  patientName: string;
  oldAppointmentDate: string;
  oldAppointmentTime: string;
  newAppointmentDate: string;
  newAppointmentTime: string;
  doctorName: string;
  reasonForVisit: string;
  bookingId: string;
  patientEmail: string;
  patientPhone?: string;
  clinicPhone?: string;
  clinicEmail?: string;
  clinicAddress?: string;
}

const AppointmentReschedule: React.FC<AppointmentRescheduleProps> = (props) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white max-w-[600px] mx-auto rounded-[8px] shadow-lg">
            {/* Header */}
            <Section className="bg-blue-600 text-white p-[32px] rounded-t-[8px]">
              <Heading className="text-[28px] font-bold m-0 text-center">
                DENTAL U CARE
              </Heading>
              <Text className="text-[16px] text-center m-0 mt-[8px] opacity-90">
                Professional Dental Services
              </Text>
            </Section>

            {/* Reschedule Header */}
            <Section className="p-[32px]">
              <Heading className="text-[24px] font-bold text-blue-600 m-0 mb-[8px]">
                Appointment Rescheduled
              </Heading>
              <Text className="text-[16px] text-gray-700 m-0">
                Your appointment has been successfully rescheduled.
              </Text>
            </Section>

            <Hr className="border-gray-200 mx-[32px]" />

            {/* Patient Information */}
            <Section className="px-[32px] py-[24px]">
              <Heading className="text-[18px] font-semibold text-gray-800 m-0 mb-[16px]">
                Patient Information:
              </Heading>
              <Text className="text-[14px] text-gray-700 m-0 font-semibold">
                {props.patientName}
              </Text>
              <Text className="text-[14px] text-gray-600 m-0">
                Email: {props.patientEmail}
              </Text>
              {props.patientPhone && (
                <Text className="text-[14px] text-gray-600 m-0">
                  Phone: {props.patientPhone}
                </Text>
              )}
            </Section>

            <Hr className="border-gray-200 mx-[32px]" />

            {/* Previous Appointment */}
            <Section className="px-[32px] py-[24px] bg-gray-50 mx-[32px] rounded-[8px] mb-[16px]">
              <Heading className="text-[16px] font-semibold text-gray-600 m-0 mb-[12px]">
                Previous Appointment:
              </Heading>
              <Text className="text-[14px] text-gray-700 m-0 mb-[4px]">
                <strong>Date:</strong> {props.oldAppointmentDate}
              </Text>
              <Text className="text-[14px] text-gray-700 m-0">
                <strong>Time:</strong> {props.oldAppointmentTime}
              </Text>
            </Section>

            {/* New Appointment Details */}
            <Section className="px-[32px] py-[24px] bg-blue-50 mx-[32px] rounded-[8px]">
              <Heading className="text-[18px] font-semibold text-blue-800 m-0 mb-[16px]">
                New Appointment Details:
              </Heading>
              <Row>
                <Column className="w-[50%]">
                  <Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
                    <strong>Booking ID:</strong> {props.bookingId}
                  </Text>
                  <Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
                    <strong>Date:</strong> {props.newAppointmentDate}
                  </Text>
                  <Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
                    <strong>Time:</strong> {props.newAppointmentTime}
                  </Text>
                </Column>
                <Column className="w-[50%]">
                  <Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
                    <strong>Doctor:</strong> {props.doctorName}
                  </Text>
                  <Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
                    <strong>Service:</strong> {props.reasonForVisit}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* Important Reminders */}
            <Section className="px-[32px] py-[24px]">
              <Heading className="text-[18px] font-semibold text-gray-800 m-0 mb-[16px]">
                Important Reminders:
              </Heading>
              <Text className="text-[14px] text-gray-700 mb-[8px] leading-[20px]">
                • Please arrive 10 minutes early for check-in
              </Text>
              <Text className="text-[14px] text-gray-700 mb-[8px] leading-[20px]">
                • Bring a valid ID and insurance card (if applicable)
              </Text>
              <Text className="text-[14px] text-gray-700 mb-[8px] leading-[20px]">
                • If you need to make further changes, please contact us at least 24 hours in advance
              </Text>
            </Section>

            {/* View Appointment Button */}
            <Section className="px-[32px] py-[24px] text-center">
              <Button
                href={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/patient/appointments`}
                className="box-border bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline inline-block"
              >
                View My Appointments
              </Button>
            </Section>

            {/* Contact Information */}
            <Section className="px-[32px] py-[24px] bg-gray-50 mx-[32px] rounded-[8px]">
              <Heading className="text-[16px] font-semibold text-gray-800 m-0 mb-[12px]">
                Need to Make Changes?
              </Heading>
              <Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
                If you need to make further changes to your appointment, please contact us:
              </Text>
              <Text className="text-[14px] text-blue-600 font-semibold m-0 mb-[4px]">
                Phone: {props.clinicPhone || "(043) 756-1234"}
              </Text>
              <Text className="text-[14px] text-blue-600 font-semibold m-0">
                Email: {props.clinicEmail || "info@dentalucare.com"}
              </Text>
            </Section>

            {/* Footer */}
            <Section className="px-[32px] py-[24px] text-center border-t-[1px] border-solid border-gray-200">
              <Text className="text-[14px] text-gray-600 m-0 mb-[8px]">
                Your appointment has been successfully rescheduled.
              </Text>
              <Text className="text-[12px] text-gray-500 m-0 mb-[8px]">
                We look forward to seeing you on {props.newAppointmentDate} at {props.newAppointmentTime}
              </Text>
              <Text className="text-[12px] text-gray-500 m-0">
                Dental U Care Clinic | {props.clinicAddress || "Baltan Street, Puerto Princesa City, Palawan"}
              </Text>
            </Section>

            {/* Company Footer */}
            <Section className="px-[32px] py-[16px] bg-gray-50 text-center rounded-b-[8px]">
              <Text className="text-[12px] text-gray-500 m-0">
                © {new Date().getFullYear()} Dental U Care. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AppointmentReschedule;

