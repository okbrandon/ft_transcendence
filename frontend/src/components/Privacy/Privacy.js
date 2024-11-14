import React, { useEffect } from "react";
import {
	HeaderContent,
	PrivacyContainer,
	PrivacyContent,
	PrivacySection
} from "./styles/Privacy.styled";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Privacy = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<PrivacySection>
			<i className="bi bi-arrow-left" onClick={() => navigate(-1)}/>
			<PrivacyContainer>
				<h1>{t("privacyPolicy.title")}</h1>
				<h2>{t("privacyPolicy.lastUpdated", { date: "November 13, 2024" })}</h2>
				<HeaderContent>
					{t("privacyPolicy.intro")}
				</HeaderContent>
				<PrivacyContent>
					<div className="divider">
						<h3>{t("privacyPolicy.sections.informationWeCollect.title")}</h3>
						<p>{t("privacyPolicy.sections.informationWeCollect.description")}</p>
						<p>- <b>{t("privacyPolicy.sections.informationWeCollect.details.account")}</b>: {t("privacyPolicy.sections.informationWeCollect.examples.account")}</p>
						<p>- <b>{t("privacyPolicy.sections.informationWeCollect.details.profile")}</b>: {t("privacyPolicy.sections.informationWeCollect.examples.profile")}</p>
						<p>- <b>{t("privacyPolicy.sections.informationWeCollect.details.gameplay")}</b>: {t("privacyPolicy.sections.informationWeCollect.examples.gameplay")}</p>
						<p>- <b>{t("privacyPolicy.sections.informationWeCollect.details.communications")}</b>: {t("privacyPolicy.sections.informationWeCollect.examples.communications")}</p>
						<p>- <b>{t("privacyPolicy.sections.informationWeCollect.details.transactions")}</b>: {t("privacyPolicy.sections.informationWeCollect.examples.transactions")}</p>
					</div>
					<div className="divider">
						<h3>{t("privacyPolicy.sections.howWeUseInformation.title")}</h3>
						<p>{t("privacyPolicy.sections.howWeUseInformation.description")}</p>
						{t("privacyPolicy.sections.howWeUseInformation.details", { returnObjects: true }).map((item, index) => (
							<p key={index}>- {item}</p>
						))}
					</div>
					<div className="divider">
						<h3>{t("privacyPolicy.sections.dataSharing.title")}</h3>
						<p>{t("privacyPolicy.sections.dataSharing.description")}</p>
						<p>- <b>{t("privacyPolicy.sections.dataSharing.examples.email")}</b>: <span onClick={() => window.open(t("privacyPolicy.sections.dataSharing.links.emailService"))}>Resend</span></p>
						<p>- <b>{t("privacyPolicy.sections.dataSharing.examples.phone")}</b>: <span onClick={() => window.open(t("privacyPolicy.sections.dataSharing.links.phoneService"))}>Plivo</span></p>
					</div>
					<div className="divider">
						<h3>{t("privacyPolicy.sections.dataRetention.title")}</h3>
						<p>{t("privacyPolicy.sections.dataRetention.description")}</p>
					</div>
					<div className="divider">
						<h3>{t("privacyPolicy.sections.security.title")}</h3>
						<p>{t("privacyPolicy.sections.security.description")}</p>
					</div>
				</PrivacyContent>
			</PrivacyContainer>
		</PrivacySection>
	);
};

export default Privacy;
