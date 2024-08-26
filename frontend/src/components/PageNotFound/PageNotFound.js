import React from "react";
import { BrokenText, Message, PageContainer, PongContainer, ReturnButton } from "./styles/PageNotFound.styled";

const PageNotFound = () => {
	return (
		<PageContainer>
			<h1>404</h1>
			<PongContainer>
				<img src="/images/404.gif" alt="Pong"/>
			</PongContainer>
			<Message>Oops! The page you were looking for isn't here.</Message>
			<ReturnButton to="/">Return Home</ReturnButton>
		</PageContainer>
	);
};

export default PageNotFound;
