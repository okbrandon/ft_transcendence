import React, { useEffect } from "react";
import {
	HeaderContent,
	PrivacyContainer,
	PrivacyContent,
	PrivacySection
} from "./styles/Privacy.styled";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
	const navigate = useNavigate();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<PrivacySection>
			<i className="bi bi-arrow-left" onClick={() => navigate(-1)}/>
			<PrivacyContainer>
				<h1>Privacy Policy</h1>
				<h2>Last Updated: November 13, 2024</h2>
				<HeaderContent>
					Your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your information.
				</HeaderContent>
				<PrivacyContent>
					<div className="divider">
						<h3>1. Information We Collect</h3>
						<p>We collect the following types of information:</p>
						<p>- <b>Account Details</b>: User IDs, usernames, email addresses, and passwords (stored securely).</p>
						<p>- <b>Profile Communication</b>: Display names, avatars, bios, and language preferences.</p>
						<p>- <b>Gameplay Data</b>: Matches, scores, tournaments, game tokens, and user settings.</p>
						<p>- <b>Communications</b>: Messages and conversation data for chats and tournament invites.</p>
						<p>- <b>Transactions</b>: Purchase history for store items.</p>
					</div>
					<div className="divider">
						<h3>2. How We Use Your Information</h3>
						<p>We use the collected information to:</p>
						<p>- Create and manage your account.</p>
						<p>- Facilitate gameplay, matches, and tournaments.</p>
						<p>- Enable messaging and notifications.</p>
						<p>- Ensure account security and prevent fraud.</p>
					</div>
					<div className="divider">
						<h3>3. Data Sharing</h3>
						<p>We may share certain information with third-party service providers:</p>
						<p>- <b>Email Addresses</b>: Shared with <span onClick={() => window.open('https://resend.com/')}>Resend</span> to handle email services (e.g., account verification, notifications).</p>
						<p>- <b>Phone Numbers</b>: Shared with <span onClick={() => window.open('https://www.plivo.com/sms/')}>Plivo</span> for SMS-based services (e.g., account recovery, notifications).</p>
					</div>
					<div className="divider">
						<h3>Data Retention</h3>
						<p>We retain your data as long as your account is active. If you delete your account, we will remove your data, except where legally required to keep it.</p>
					</div>
					<div className="divider">
						<h3>5. Security</h3>
						<p>We use industry-standard measures to protect your data. However, no system is completely secure—please safeguard your account.</p>
					</div>
				</PrivacyContent>
			</PrivacyContainer>
		</PrivacySection>
	);
};

export default Privacy;
