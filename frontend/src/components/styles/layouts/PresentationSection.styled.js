import styled from "styled-components";
import Section from "./Section.styled";

const PresentationSection = styled(Section)`
	background-color: rgba(0, 0, 0, 1);
	background-image: linear-gradient(
		-90deg,
		transparent calc(5em - 1px),
		rgba(255, 255, 255, 0.4) calc(5em - 1px + 5px),
		rgba(255, 255, 255, 0.4) 5em
	),
	linear-gradient(
		0deg,
		transparent calc(5em - 1px),
		rgba(255, 255, 255, 0.4) calc(5em - 1px + 5px),
		rgba(255, 255, 255, 0.4) 5em
	);
	background-size: 5em 5em;
`;

export default PresentationSection;
