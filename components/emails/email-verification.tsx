import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Tailwind,
} from "@react-email/components";

interface VerificationEmailProps {
  username  ?: string;
  verificationUrl?: string;
}

const VerificationEmail = (props: VerificationEmailProps) => {
  const { username, verificationUrl } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] shadow-lg max-w-[600px] mx-auto p-[40px]">
            {/* Header */}
            <Section className="text-center mb-[32px]">
              <Text className="text-[32px] font-bold text-blue-600 m-0 mb-[8px]">
                Dental U Care
              </Text>
              <Text className="text-[16px] text-gray-600 m-0">
                Your Trusted Dental Care Partner
              </Text>
            </Section>

            {/* Main Content */}
            <Section>
              <Text className="text-[24px] font-bold text-gray-800 mb-[24px] m-0">
                Verify Your Email Address
              </Text>
              <Text className="text-[16px] text-gray-700 mb-[24px] m-0 leading-[24px]">
                Thank you {username} for choosing Dental U Care! To complete your account
                setup and ensure secure access to your dental care portal,
                please verify your email address by clicking the button below.
              </Text>

              {/* Verification Button */}
              <Section className="text-center my-[32px]">
                <Button
                  href={verificationUrl}
                  className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border hover:bg-blue-700 transition-colors"
                >
                  Verify Email Address
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-[24px] m-0 leading-[20px]">
                If the button above doesn`t work, you can also copy and paste
                this link into your browser:
              </Text>

              <Text className="text-[14px] text-blue-600 mb-[32px] m-0 break-all">
                {verificationUrl}
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[24px] m-0 leading-[24px]">
                This verification link will expire in 24 hours for your
                security. If you didn`t create an account with Dental U Care,
                please ignore this email.
              </Text>
            </Section>

            <Hr className="border-gray-200 my-[32px]" />

            {/* Footer */}
            <Section>
              <Text className="text-[14px] text-gray-600 mb-[16px] m-0">
                Need help? Contact our support team at{" "}
                <a
                  href="mailto:support@dentalucare.com"
                  className="text-blue-600 no-underline"
                >
                  send@dentalucare.tech
                </a>{" "}
                or call us at (+63) 917-123-4567.
              </Text>

              <Text className="text-[12px] text-gray-500 m-0 mb-[8px]">
                Dental U Care Clinic
              </Text>
              <Text className="text-[12px] text-gray-500 m-0 mb-[8px]">
                Baltan Street, Barangay San Miguel
              </Text>
              <Text className="text-[12px] text-gray-500 m-0 mb-[16px]">
               Puerto Princesa, Palawan, Philippines
              </Text>

              <Text className="text-[12px] text-gray-500 m-0">
                © 2025 Dental U Care. All rights reserved.{" "}
                <a href="#" className="text-blue-600 no-underline">
                  Unsubscribe
                </a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};


export default VerificationEmail;
