import React from "react";

export default function TermsAndConditions() {
  return (
    <section className="max-w-3xl mx-auto py-10 px-4 text-gray-800">
      <h1 className="text-3xl font-bold mb-4 text-center">Terms and Conditions</h1>
      <h2 className="text-xl font-semibold mb-2 text-center">Dental U Care</h2>
      <p className="mb-6 text-center">
        Welcome to Dental U Care. By accessing our website, booking an appointment, or receiving services at our clinic, you agree to the following Terms and Conditions. Please read them carefully before engaging with our services.
      </p>
      <ol className="list-decimal pl-6 space-y-4">
        <li>
          <strong>General Terms</strong><br />
          Dental U Care provides dental healthcare services in accordance with professional and ethical standards.<br />
          These Terms apply to all patients, clients, and users who interact with our clinic, whether in person, by phone, or online.<br />
          We reserve the right to update these Terms at any time. Any changes will be posted on our premises or website.
        </li>
        <li>
          <strong>Appointments and Cancellations</strong><br />
          Appointments can be booked via phone, online, or in person.<br />
          Please arrive at least 10 minutes before your scheduled time.<br />
          Appointment cancellations must be made at least 24 hours in advance. Late cancellations or missed appointments may result in a cancellation fee.
        </li>
        <li>
          <strong>Payments and Billing</strong><br />
          Fees for dental services are determined based on the procedure and disclosed prior to treatment whenever possible.<br />
          Payment is required at the time of service unless otherwise arranged.<br />
          We accept cash, major credit/debit cards, and approved insurance.<br />
          Any additional laboratory or specialist fees will be discussed before proceeding.
        </li>
        <li>
          <strong>Insurance and Claims</strong><br />
          Dental U Care assists patients in processing insurance claims but is not responsible for approval or denial of coverage.<br />
          Patients remain fully responsible for any amount not covered by insurance.
        </li>
        <li>
          <strong>Patient Responsibilities</strong><br />
          Patients must provide accurate and complete medical and dental history information.<br />
          Any changes to health status, medications, or allergies must be reported promptly.<br />
          Patients are expected to follow the dentist’s recommended care and post-treatment instructions.
        </li>
        <li>
          <strong>Treatment Consent</strong><br />
          Before any procedure, your dentist will explain the diagnosis, treatment options, and estimated costs.<br />
          By agreeing to proceed, you acknowledge that you understand the risks and benefits of the treatment.<br />
          Written consent may be required for certain procedures.
        </li>
        <li>
          <strong>Privacy and Confidentiality</strong><br />
          Dental U Care complies with applicable privacy laws regarding the protection of personal and medical information.<br />
          Your records will not be shared without your consent, except as required by law or for insurance processing.
        </li>
        <li>
          <strong>Disclaimer of Liability</strong><br />
          While our professionals strive to provide high-quality care, results may vary depending on individual conditions.<br />
          Dental U Care is not liable for post-treatment complications that arise from failure to follow prescribed care or external factors beyond our control.
        </li>
        <li>
          <strong>Intellectual Property</strong><br />
          All content on our website and marketing materials—including text, logos, and images—is owned by Dental U Care and may not be copied or reproduced without permission.
        </li>
        <li>
          <strong>Governing Law</strong><br />
          These Terms are governed by and construed in accordance with the laws of the Republic of the Philippines.<br />
          Any disputes shall be handled within the proper courts of Puerto Princesa City, Palawan.
        </li>
        <li>
          <strong>Contact Information</strong><br />
          For questions regarding these Terms, please contact:<br />
          Dental U Care<br />
          Address: <span className="italic">[Baltan Street, Puerto Princesa City, Palawan]</span><br />
          Phone: <span className="italic">[63+ 1234 5678]</span><br />
          Email: <span className="italic">[info@dentalucare.com]</span>
        </li>
      </ol>
    </section>
  );
}
