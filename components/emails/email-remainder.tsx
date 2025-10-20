import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Row,
  Column,
  Hr,
} from "@react-email/components";

interface DentalAppointmentReminderProps {
    patientName: string;
    appointmentDate: string;
    appointmentTime: string;
    doctorName: string;
    treatmentType: string;
    duration: string;
    clinicPhone: string;
    clinicEmail: string;
    clinicAddress: string;
}

interface DentalAppointmentReminderComponent
    extends React.FC<DentalAppointmentReminderProps> {
    PreviewProps?: DentalAppointmentReminderProps;
}

const DentalAppointmentReminder: DentalAppointmentReminderComponent = (
    props: DentalAppointmentReminderProps
) => {
    return (
        <Html lang="en" dir="ltr">
            <Tailwind>
                <Head />
                <Preview>
                    Your upcoming appointment at Dental U Care - {props.appointmentDate}
                </Preview>
                <Body className="bg-gray-100 font-sans py-[40px]">
                    <Container className="bg-white rounded-[8px] shadow-lg max-w-[600px] mx-auto p-[40px]">
                        {/* Header */}
                        <Section className="text-center mb-[32px]">
                            <Heading className="text-[28px] font-bold text-blue-600 m-0 mb-[8px]">
                                Dental U Care
                            </Heading>
                            <Text className="text-[16px] text-gray-600 m-0">
                                Your Smile, Our Priority
                            </Text>
                        </Section>

                        {/* Main Content */}
                        <Section className="mb-[32px]">
                            <Heading className="text-[24px] font-bold text-gray-800 mb-[16px]">
                                Appointment Reminder
                            </Heading>
                            <Text className="text-[16px] text-gray-700 mb-[24px] leading-[24px]">
                                Dear {props.patientName},
                            </Text>
                            <Text className="text-[16px] text-gray-700 mb-[24px] leading-[24px]">
                                This is a friendly reminder about your upcoming dental
                                appointment at Dental U Care.
                            </Text>
                        </Section>

                        {/* Appointment Details */}
                        <Section className="bg-blue-50 rounded-[8px] p-[24px] mb-[32px]">
                            <Heading className="text-[20px] font-bold text-blue-800 mb-[16px]">
                                Appointment Details
                            </Heading>
                            <Row className="mb-[12px]">
                                <Column className="w-[120px]">
                                    <Text className="text-[14px] font-semibold text-gray-600 m-0">
                                        Date:
                                    </Text>
                                </Column>
                                <Column>
                                    <Text className="text-[14px] text-gray-800 m-0">
                                        {props.appointmentDate}
                                    </Text>
                                </Column>
                            </Row>
                            <Row className="mb-[12px]">
                                <Column className="w-[120px]">
                                    <Text className="text-[14px] font-semibold text-gray-600 m-0">
                                        Time:
                                    </Text>
                                </Column>
                                <Column>
                                    <Text className="text-[14px] text-gray-800 m-0">
                                        {props.appointmentTime}
                                    </Text>
                                </Column>
                            </Row>
                            <Row className="mb-[12px]">
                                <Column className="w-[120px]">
                                    <Text className="text-[14px] font-semibold text-gray-600 m-0">
                                        Doctor:
                                    </Text>
                                </Column>
                                <Column>
                                    <Text className="text-[14px] text-gray-800 m-0">
                                        {props.doctorName}
                                    </Text>
                                </Column>
                            </Row>
                            <Row className="mb-[12px]">
                                <Column className="w-[120px]">
                                    <Text className="text-[14px] font-semibold text-gray-600 m-0">
                                        Treatment:
                                    </Text>
                                </Column>
                                <Column>
                                    <Text className="text-[14px] text-gray-800 m-0">
                                        {props.treatmentType}
                                    </Text>
                                </Column>
                            </Row>
                            <Row>
                                <Column className="w-[120px]">
                                    <Text className="text-[14px] font-semibold text-gray-600 m-0">
                                        Duration:
                                    </Text>
                                </Column>
                                <Column>
                                    <Text className="text-[14px] text-gray-800 m-0">
                                        {props.duration}
                                    </Text>
                                </Column>
                            </Row>
                        </Section>

                        {/* Important Notes */}
                        <Section className="mb-[32px]">
                            <Heading className="text-[18px] font-bold text-gray-800 mb-[16px]">
                                Important Reminders
                            </Heading>
                            <Text className="text-[14px] text-gray-700 mb-[8px] leading-[20px]">
                                • Please arrive 10 minutes early for check-in
                            </Text>
                            <Text className="text-[14px] text-gray-700 mb-[8px] leading-[20px]">
                                • Bring a valid ID and insurance card
                            </Text>
                            <Text className="text-[14px] text-gray-700 mb-[8px] leading-[20px]">
                                • If you need to reschedule, please call us at least 24 hours in
                                advance
                            </Text>
                            <Text className="text-[14px] text-gray-700 mb-[8px] leading-[20px]">
                                • Continue your regular oral hygiene routine before your visit
                            </Text>
                        </Section>

                        {/* Contact Information */}
                        <Section className="mb-[32px]">
                            <Heading className="text-[18px] font-bold text-gray-800 mb-[16px]">
                                Need to Make Changes?
                            </Heading>
                            <Text className="text-[16px] text-gray-700 mb-[16px] leading-[24px]">
                                If you need to reschedule or cancel your appointment, please
                                contact us:
                            </Text>
                            <Text className="text-[16px] text-blue-600 font-semibold mb-[8px]">
                                Phone: {props.clinicPhone}
                            </Text>
                            <Text className="text-[16px] text-blue-600 font-semibold mb-[16px]">
                                Email: {props.clinicEmail}
                            </Text>
                        </Section>

                        <Hr className="border-gray-300 mb-[32px]" />

                        {/* Footer */}
                        <Section className="text-center">
                            <Text className="text-[14px] text-gray-600 mb-[8px]">
                                Dental U Care
                            </Text>
                            <Text className="text-[14px] text-gray-600 mb-[8px] m-0">
                                {props.clinicAddress}
                            </Text>
                            <Text className="text-[14px] text-gray-600 mb-[16px]">
                                Phone: {props.clinicPhone} | Email: {props.clinicEmail}
                            </Text>
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
export default DentalAppointmentReminder;
