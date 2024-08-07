import styled from "styled-components";

const SpaceBetweenContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	${({ $gap }) => $gap && `gap: ${$gap}`};
`;

export default SpaceBetweenContainer;
