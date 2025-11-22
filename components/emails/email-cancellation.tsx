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

export interface AppointmentCancellationProps {
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorName: string;
  reasonForVisit: string;
  cancelReason?: string;
  bookingId: string;
  patientEmail: string;
  clinicPhone?: string;
  clinicEmail?: string;
  clinicAddress?: string;
}

const AppointmentCancellation: React.FC<AppointmentCancellationProps> = (
  props
) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white max-w-[600px] mx-auto rounded-[8px] shadow-lg">
            {/* Header */}
            <Section className="bg-red-600 text-white p-[32px] rounded-t-[8px]">
              <Heading className="text-[28px] font-bold m-0 text-center">
                DENTAL U CARE
              </Heading>
              <Text className="text-[16px] text-center m-0 mt-[8px] opacity-90">
                Professional Dental Services
              </Text>
            </Section>

            {/* Cancellation Header */}
            <Section className="p-[32px]">
              <Heading className="text-[24px] font-bold text-red-600 m-0 mb-[8px]">
                Appointment Cancelled
              </Heading>
              <Text className="text-[16px] text-gray-700 m-0">
                Your appointment has been cancelled as requested.
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
            </Section>

            <Hr className="border-gray-200 mx-[32px]" />

            {/* Cancelled Appointment Details */}
            <Section className="px-[32px] py-[24px] bg-red-50 mx-[32px] rounded-[8px]">
              <Heading className="text-[18px] font-semibold text-gray-800 m-0 mb-[16px]">
                Cancelled Appointment Details:
              </Heading>
              <Row>
                <Column className="w-[50%]">
                  <Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
                    <strong>Booking ID:</strong> {props.bookingId}
                  </Text>
                  <Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
                    <strong>Date:</strong> {props.appointmentDate}
                  </Text>
                  <Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
                    <strong>Time:</strong> {props.appointmentTime}
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
              {props.cancelReason && (
                <Text className="text-[14px] text-gray-700 m-0 mt-[12px]">
                  <strong>Cancellation Reason:</strong> {props.cancelReason}
                </Text>
              )}
            </Section>

            {/* Next Steps */}
            <Section className="px-[32px] py-[24px]">
              <Heading className="text-[18px] font-semibold text-gray-800 m-0 mb-[16px]">
                What&apos;s Next?
              </Heading>
              <Text className="text-[14px] text-gray-700 mb-[8px] leading-[20px]">
                Your appointment has been successfully cancelled. If you need to
                reschedule or book a new appointment, please contact us or visit
                our website.
              </Text>
            </Section>

            {/* Book New Appointment Button */}
            <Section className="px-[32px] py-[24px] text-center">
              <Button
                href={`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/patient/book-appointment`}
                className="box-border bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline inline-block"
              >
                Book New Appointment
              </Button>
            </Section>

            {/* Contact Information */}
            <Section className="px-[32px] py-[24px] bg-gray-50 mx-[32px] rounded-[8px]">
              <Heading className="text-[16px] font-semibold text-gray-800 m-0 mb-[12px]">
                Need Assistance?
              </Heading>
              <Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
                If you have any questions or would like to reschedule, please
                contact us:
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
                We&apos;re sorry to see you go, but we understand that sometimes
                plans change.
              </Text>
              <Text className="text-[12px] text-gray-500 m-0 mb-[8px]">
                We hope to serve you in the future. If you need to reschedule,
                please don&apos;t hesitate to contact us.
              </Text>
              <Text className="text-[12px] text-gray-500 m-0">
                Dental U Care Clinic |{" "}
                {props.clinicAddress ||
                  "Baltan Street, Puerto Princesa City, Palawan"}
              </Text>
            </Section>

            {/* Company Footer */}
            <Section className="px-[32px] py-[16px] bg-gray-50 text-center rounded-b-[8px]">
              <Text className="text-[12px] text-gray-500 m-0">
                © {new Date().getFullYear()} Dental U Care. All rights
                reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AppointmentCancellation;
