import React from "react";
import { FooterContainer } from "../../styles/Home/Footer.styled";
import { Title } from "../../styles/shared/Title.styled";

const Footer = () => {
	return (
		<FooterContainer>
			<Title>PONG</Title><br/>
			<p>42 ft_transcendence</p>
			<p>Made by <strong>Kian</strong>, <strong>Evan</strong>, <strong>Brandon</strong>, and <strong>Hanmin</strong></p>
			<p>&copy; PONG 2024</p>
		</FooterContainer>
	);
};

export default Footer;
