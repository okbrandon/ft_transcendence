import styled from "styled-components";
import Section from "./Section.styled";

const BannerSection = styled(Section)`
	min-height: 85vh;
	border-bottom: 5px solid #fff;

	& > h1 {
		color: rgb(200,200,200);
		font-family: 'Orbitron', serif;
		font-size: 70px;
		z-index: 100;
		margin-bottom: 30px;
	}
`;

export default BannerSection;
