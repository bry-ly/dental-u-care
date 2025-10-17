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
interface ForgotPasswordEmailProps {
  username?: string;
  resetUrl?: string;
  userEmail?: string;
}

const ForgotPasswordEmail = (props: ForgotPasswordEmailProps) => {
  const { username, resetUrl, userEmail } = props;

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
                Reset Your Password
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[24px] m-0 leading-[24px]">
                Hello {username}
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[24px] m-0 leading-[24px]">
                We received a request to reset the password for your {userEmail} Dental U
                Care account. Don`t worry - it happens to the best of us! Click
                the button below to create a new password.
              </Text>

              {/* Reset Password Button */}
              <Section className="text-center my-[32px]">
                <Button
                  href={resetUrl}
                  className="bg-green-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border hover:bg-green-700 transition-colors"
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-[24px] m-0 leading-[20px]">
                If the button above doesn`t work, you can also copy and paste
                this link into your browser:
              </Text>

              <Text className="text-[14px] text-blue-600 mb-[32px] m-0 break-all">
                {resetUrl}
              </Text>

              <Section className="bg-yellow-50 border-l-[4px] border-yellow-400 p-[16px] mb-[24px] rounded-[4px]">
                <Text className="text-[14px] text-yellow-800 m-0 font-semibold mb-[8px]">
                  Important Security Information:
                </Text>
                <Text className="text-[14px] text-yellow-700 m-0 leading-[20px]">
                  • This reset link will expire in 1 hour for your security
                  <br />
                  • If you didn`t request this password reset, please ignore
                  this email
                  <br />• Your current password will remain unchanged until you
                  create a new one
                </Text>
              </Section>

              <Text className="text-[16px] text-gray-700 mb-[24px] m-0 leading-[24px]">
                For your account security, we recommend choosing a strong
                password that includes a mix of letters, numbers, and special
                characters.
              </Text>
            </Section>

            <Hr className="border-gray-200 my-[32px]" />

            {/* Footer */}
            <Section>
              <Text className="text-[14px] text-gray-600 mb-[16px] m-0">
                Having trouble? Our support team is here to help at{" "}
                <a
                  href="mailto:info@dentalucare.com"
                  className="text-blue-600 no-underline"
                >
                  info@dentalucare.com
                </a>{" "}
                or call us at (+63) 917-123-4567.
              </Text>

              <Text className="text-[12px] text-gray-500 m-0 mb-[8px]">
                Dental U Care
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


export default ForgotPasswordEmail;
