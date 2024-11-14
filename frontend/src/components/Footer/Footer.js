import React from "react";
import { FooterContainer } from "./styles/Footer.styled";
import { Title } from "../../styles/shared/Title.styled";
import { useTranslation, Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Footer = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<FooterContainer>
			<Title>{t('footer.title')}</Title><br/>
			<p>{t('footer.subTitle')}</p>
			<p>
				<Trans i18nKey="footer.authors" components={[<strong key="first"/>, <strong key="second"/>, <strong key="third"/>, <strong key="fourth"/>]} values={{
						firstAuthor: "Kian",
						secondAuthor: "Evan",
						thirdAuthor: "Brandon",
						fourthAuthor: "Hanmin"
					}} />
			</p>
			<p className="privacy-policy" onClick={() => navigate('/privacy-policy')}>{t('footer.privacyPolicy')}</p>
			<p>&copy; {t('footer.copyright')}</p>
		</FooterContainer>
	);
};

export default Footer;
