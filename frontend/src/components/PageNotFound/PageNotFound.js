import React from "react";
import { Message, PageContainer, PongContainer, ReturnButton } from "./styles/PageNotFound.styled";
import { useTranslation } from "react-i18next";

const PageNotFound = () => {
	const { t } = useTranslation();

	return (
		<PageContainer>
			<h1>{t('pageNotFound.title')}</h1>
			<PongContainer>
				<img src="/images/404.gif" alt="Pong"/>
			</PongContainer>
			<Message>{t('pageNotFound.subTitle')}</Message>
			<ReturnButton to="/">{t('pageNotFound.backButton')}</ReturnButton>
		</PageContainer>
	);
};

export default PageNotFound;
