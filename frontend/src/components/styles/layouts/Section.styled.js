import styled from "styled-components";

const Section = styled.section`
	display: flex;
	position: relative;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	z-index: 100;
	${({ height }) => height && `height: ${height};`}
`;

export default Section;
