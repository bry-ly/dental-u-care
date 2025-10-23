import * as React from "react";

export interface DentalInvoiceProps {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  patientName: string;
  patientAddress: string;
  patientCity: string;
  patientPhone: string;
  patientEmail: string;
  bookingId: string;
  appointmentDate: string;
  appointmentTime: string;
  doctorName: string;
  treatmentRoom: string;
  appointmentDuration: string;
  reasonForVisit: string;
  pdfDownloadUrl: string;
  paymentStatus: string;
  nextAppointmentDate: string;
  nextAppointmentTime: string;
  nextAppointmentPurpose: string;
}
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

const DentalInvoice: React.FC<DentalInvoiceProps> = (props) => {
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

            {/* Invoice Header */}
            <Section className="p-[32px]">
              <Row>
                <Column>
                  <Heading className="text-[24px] font-bold text-gray-800 m-0">
                    INVOICE
                  </Heading>
                  <Text className="text-[14px] text-gray-600 m-0 mt-[4px]">
                    Invoice #: {props.invoiceNumber}
                  </Text>
                  <Text className="text-[14px] text-gray-600 m-0">
                    Date: {props.invoiceDate}
                  </Text>
                  <Text className="text-[14px] text-gray-600 m-0">
                    Due Date: {props.dueDate}
                  </Text>
                </Column>
                <Column align="right">
                  <Text className="text-[14px] text-gray-600 m-0 font-semibold">
                    Dental U Care Clinic
                  </Text>
                  <Text className="text-[14px] text-gray-600 m-0">
                    123 Smile Street
                  </Text>
                  <Text className="text-[14px] text-gray-600 m-0">
                    Lipa City, Batangas 4217
                  </Text>
                  <Text className="text-[14px] text-gray-600 m-0">
                    Phone: (043) 756-1234
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className="border-gray-200 mx-[32px]" />

            {/* Patient Information */}
            <Section className="px-[32px] py-[24px]">
              <Heading className="text-[18px] font-semibold text-gray-800 m-0 mb-[16px]">
                Bill To:
              </Heading>
              <Text className="text-[14px] text-gray-700 m-0 font-semibold">
                {props.patientName}
              </Text>
              <Text className="text-[14px] text-gray-600 m-0">
                {props.patientAddress}
              </Text>
              <Text className="text-[14px] text-gray-600 m-0">
                {props.patientCity}
              </Text>
              <Text className="text-[14px] text-gray-600 m-0">
                Phone: {props.patientPhone}
              </Text>
              <Text className="text-[14px] text-gray-600 m-0">
                Email: {props.patientEmail}
              </Text>
            </Section>

            <Hr className="border-gray-200 mx-[32px]" />

            {/* Booking Details */}
            <Section className="px-[32px] py-[24px] bg-blue-50 mx-[32px] rounded-[8px]">
              <Heading className="text-[18px] font-semibold text-gray-800 m-0 mb-[16px]">
                Appointment Details:
              </Heading>
              <Row>
                <Column className="w-[50%]">
                  <Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
                    <strong>Booking ID:</strong> {props.bookingId}
                  </Text>
                  <Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
                    <strong>Appointment Date:</strong> {props.appointmentDate}
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
                    <strong>Treatment Room:</strong> {props.treatmentRoom}
                  </Text>
                  <Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
                    <strong>Duration:</strong> {props.appointmentDuration}
                  </Text>
                </Column>
              </Row>
              <Text className="text-[14px] text-gray-700 m-0 mt-[12px]">
                <strong>Reason for Visit:</strong> {props.reasonForVisit}
              </Text>
            </Section>

            <Hr className="border-gray-200 mx-[32px] my-[24px]" />

            {/* Services Table */}
            <Section className="px-[32px] py-[24px]">
              <Heading className="text-[18px] font-semibold text-gray-800 m-0 mb-[16px]">
                Services Rendered:
              </Heading>

              {/* Table Header */}
              <Row className="bg-gray-50 border-solid border-[1px] border-gray-200">
                <Column className="p-[12px] w-[50%]">
                  <Text className="text-[14px] font-semibold text-gray-700 m-0">
                    Description
                  </Text>
                </Column>
                <Column className="p-[12px] w-[15%] text-center">
                  <Text className="text-[14px] font-semibold text-gray-700 m-0">
                    Qty
                  </Text>
                </Column>
                <Column className="p-[12px] w-[20%] text-center">
                  <Text className="text-[14px] font-semibold text-gray-700 m-0">
                    Unit Price
                  </Text>
                </Column>
                <Column className="p-[12px] w-[15%] text-center">
                  <Text className="text-[14px] font-semibold text-gray-700 m-0">
                    Total
                  </Text>
                </Column>
              </Row>

              {/* Service Items */}
              <Row className="border-solid border-[1px] border-t-0 border-gray-200">
                <Column className="p-[12px] w-[50%]">
                  <Text className="text-[14px] text-gray-700 m-0">
                    Dental Cleaning & Prophylaxis
                  </Text>
                </Column>
                <Column className="p-[12px] w-[15%] text-center">
                  <Text className="text-[14px] text-gray-700 m-0">1</Text>
                </Column>
                <Column className="p-[12px] w-[20%] text-center">
                  <Text className="text-[14px] text-gray-700 m-0">
                    ₱2,500.00
                  </Text>
                </Column>
                <Column className="p-[12px] w-[15%] text-center">
                  <Text className="text-[14px] text-gray-700 m-0">
                    ₱2,500.00
                  </Text>
                </Column>
              </Row>

              <Row className="border-solid border-[1px] border-t-0 border-gray-200">
                <Column className="p-[12px] w-[50%]">
                  <Text className="text-[14px] text-gray-700 m-0">
                    Tooth Filling (Composite)
                  </Text>
                </Column>
                <Column className="p-[12px] w-[15%] text-center">
                  <Text className="text-[14px] text-gray-700 m-0">2</Text>
                </Column>
                <Column className="p-[12px] w-[20%] text-center">
                  <Text className="text-[14px] text-gray-700 m-0">
                    ₱1,800.00
                  </Text>
                </Column>
                <Column className="p-[12px] w-[15%] text-center">
                  <Text className="text-[14px] text-gray-700 m-0">
                    ₱3,600.00
                  </Text>
                </Column>
              </Row>

              <Row className="border-solid border-[1px] border-t-0 border-gray-200">
                <Column className="p-[12px] w-[50%]">
                  <Text className="text-[14px] text-gray-700 m-0">
                    Fluoride Treatment
                  </Text>
                </Column>
                <Column className="p-[12px] w-[15%] text-center">
                  <Text className="text-[14px] text-gray-700 m-0">1</Text>
                </Column>
                <Column className="p-[12px] w-[20%] text-center">
                  <Text className="text-[14px] text-gray-700 m-0">₱800.00</Text>
                </Column>
                <Column className="p-[12px] w-[15%] text-center">
                  <Text className="text-[14px] text-gray-700 m-0">₱800.00</Text>
                </Column>
              </Row>
            </Section>

            {/* Totals */}
            <Section className="px-[32px]">
              <Row>
                <Column className="w-[70%]"></Column>
                <Column className="w-[30%]">
                  <Row className="mb-[8px]">
                    <Column className="w-[60%]">
                      <Text className="text-[14px] text-gray-700 m-0">
                        Subtotal:
                      </Text>
                    </Column>
                    <Column className="w-[40%] text-right">
                      <Text className="text-[14px] text-gray-700 m-0">
                        ₱6,900.00
                      </Text>
                    </Column>
                  </Row>
                  <Row className="mb-[8px]">
                    <Column className="w-[60%]">
                      <Text className="text-[14px] text-gray-700 m-0">
                        Tax (12%):
                      </Text>
                    </Column>
                    <Column className="w-[40%] text-right">
                      <Text className="text-[14px] text-gray-700 m-0">
                        ₱828.00
                      </Text>
                    </Column>
                  </Row>
                  <Hr className="border-gray-300 my-[8px]" />
                  <Row>
                    <Column className="w-[60%]">
                      <Text className="text-[16px] font-bold text-gray-800 m-0">
                        Total Due:
                      </Text>
                    </Column>
                    <Column className="w-[40%] text-right">
                      <Text className="text-[16px] font-bold text-blue-600 m-0">
                        ₱7,728.00
                      </Text>
                    </Column>
                  </Row>
                </Column>
              </Row>
            </Section>

            {/* Download PDF Button */}
            <Section className="px-[32px] py-[24px] text-center">
              <Button
                href={props.pdfDownloadUrl}
                className="box-border bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline inline-block"
              >
                📄 Download PDF Invoice
              </Button>
              <Text className="text-[12px] text-gray-500 m-0 mt-[12px]">
                Click the button above to download a PDF copy of this invoice
              </Text>
            </Section>

            {/* Payment Information */}
            <Section className="px-[32px] py-[24px] bg-green-50 mx-[32px] my-[24px] rounded-[8px]">
              <Heading className="text-[16px] font-semibold text-gray-800 m-0 mb-[12px]">
                Payment Information
              </Heading>
              <Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
                <strong>Payment Status:</strong> {props.paymentStatus}
              </Text>
              <Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
                <strong>Payment Methods:</strong> Cash, Credit Card, Bank
                Transfer, GCash, PayMaya
              </Text>
              <Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
                <strong>Bank Details:</strong> BPI - Account #1234567890 (Dental
                U Care Clinic)
              </Text>
              <Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
                <strong>GCash:</strong> 09171234567
              </Text>
              <Text className="text-[14px] text-gray-700 m-0">
                <strong>Payment Terms:</strong> Payment due within 30 days of
                invoice date
              </Text>
            </Section>

            {/* Next Appointment */}
            <Section className="px-[32px] py-[24px] bg-yellow-50 mx-[32px] rounded-[8px]">
              <Heading className="text-[16px] font-semibold text-gray-800 m-0 mb-[12px]">
                Next Appointment Reminder
              </Heading>
              <Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
                <strong>Follow-up Date:</strong> {props.nextAppointmentDate}
              </Text>
              <Text className="text-[14px] text-gray-700 m-0 mb-[8px]">
                <strong>Time:</strong> {props.nextAppointmentTime}
              </Text>
              <Text className="text-[14px] text-gray-700 m-0">
                <strong>Purpose:</strong> {props.nextAppointmentPurpose}
              </Text>
            </Section>

            {/* Footer */}
            <Section className="px-[32px] py-[24px] text-center border-t-[1px] border-solid border-gray-200">
              <Text className="text-[14px] text-gray-600 m-0 mb-[8px]">
                Thank you for choosing Dental U Care for your oral health needs!
              </Text>
              <Text className="text-[12px] text-gray-500 m-0 mb-[8px]">
                For questions about this invoice, please contact us at
                billing@dentalucare.com or (043) 756-1234
              </Text>
              <Text className="text-[12px] text-gray-500 m-0">
                To reschedule or cancel appointments, call us at least 24 hours
                in advance
              </Text>
            </Section>

            {/* Company Footer */}
            <Section className="px-[32px] py-[16px] bg-gray-50 text-center rounded-b-[8px]">
              <Text className="text-[12px] text-gray-500 m-0">
                Dental U Care Clinic | 123 Smile Street, Lipa City, Batangas
                4217
              </Text>
              <Text className="text-[12px] text-gray-500 m-0">
                © 2024 Dental U Care. All rights reserved. | License
                #DC-2024-001
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};


export default DentalInvoice;
