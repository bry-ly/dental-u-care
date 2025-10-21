
import React from "react"

export default function GetStartedGuide() {
	return (
		<section className="max-w-3xl mx-auto py-10 px-4">
			<h1 className="text-3xl font-bold mb-4 text-center">Dental U Care – Get Started Guide</h1>
			<p className="mb-6 text-center">Welcome to Dental U Care!<br />We’re excited to help you on your journey toward better oral health. Here’s how to get started as a new patient or team member.</p>

			<div className="mb-8">
				<h2 className="text-2xl font-semibold mb-2">For Patients</h2>
				<ol className="list-decimal list-inside space-y-4">
					<li>
						<strong>Register or Book Online</strong>
						<ul className="list-disc list-inside ml-5 mt-1">
							<li>Visit our website/app and click on “Book Appointment” or “Register as New Patient.”</li>
							<li>Fill in your details: Name, email, contact number, and medical history.</li>
							<li>Choose your preferred date, time, and service (e.g., cleaning, checkup, whitening).</li>
						</ul>
					</li>
					<li>
						<strong>Confirmation & Reminders</strong>
						<ul className="list-disc list-inside ml-5 mt-1">
							<li>After booking, you’ll receive a confirmation via email or SMS with your appointment details.</li>
							<li>You can reschedule or cancel anytime via the link in your confirmation message.</li>
							<li>We’ll send you reminders 24 hours before your appointment.</li>
						</ul>
					</li>
					<li>
						<strong>Before Your Visit</strong>
						<ul className="list-disc list-inside ml-5 mt-1">
							<li>Bring a valid ID and your insurance card (if applicable).</li>
							<li>Arrive 10 minutes early for check-in and medical history review.</li>
						</ul>
					</li>
					<li>
						<strong>On Your Appointment Day</strong>
						<ul className="list-disc list-inside ml-5 mt-1">
							<li>Our friendly staff will guide you through your visit.</li>
							<li>Feel free to ask about treatment plans or payment options.</li>
						</ul>
					</li>
					<li>
						<strong>Aftercare and Follow-Up</strong>
						<ul className="list-disc list-inside ml-5 mt-1">
							<li>You may receive aftercare instructions by email or SMS.</li>
							<li>Book your next visit directly from our website or app whenever you’re ready.</li>
						</ul>
					</li>
				</ol>
			</div>

			<div className="mb-8">
				<h2 className="text-2xl font-semibold mb-2">For Staff</h2>
				<ol className="list-decimal list-inside space-y-4">
					<li>
						<strong>Secure Login</strong>
						<ul className="list-disc list-inside ml-5 mt-1">
							<li>Use your assigned credentials to log in to the Dental U Care admin portal.</li>
							<li>Update your profile and verify your contact information.</li>
						</ul>
					</li>
					<li>
						<strong>Dashboard Overview</strong>
						<ul className="list-disc list-inside ml-5 mt-1">
							<li>Access the appointments dashboard to see upcoming bookings.</li>
							<li>Use the patient records section to review medical histories or notes.</li>
						</ul>
					</li>
					<li>
						<strong>Managing Appointments</strong>
						<ul className="list-disc list-inside ml-5 mt-1">
							<li>Confirm, reschedule, or cancel bookings as needed.</li>
							<li>Send reminders and follow-up messages to patients with a single click.</li>
						</ul>
					</li>
					<li>
						<strong>Treatment Documentation</strong>
						<ul className="list-disc list-inside ml-5 mt-1">
							<li>Log treatments, prescribe medicines, and upload documents directly to each patient record.</li>
						</ul>
					</li>
					<li>
						<strong>Communication</strong>
						<ul className="list-disc list-inside ml-5 mt-1">
							<li>Use the messaging tools to answer patient queries or coordinate internally.</li>
						</ul>
					</li>
				</ol>
			</div>

			<div className="border-t pt-6 mt-8">
				<h2 className="text-xl font-semibold mb-2">Need Help?</h2>
				<ul className="list-disc list-inside ml-5">
					<li>Call our help desk at <span className="font-medium">6-1234-5678</span>, or email <span className="font-medium">support@dentalucare.com</span>.</li>
					<li>Visit our FAQ on the website for common questions about appointments, insurance, or care tips.</li>
				</ul>
			</div>
		</section>
	)
}
