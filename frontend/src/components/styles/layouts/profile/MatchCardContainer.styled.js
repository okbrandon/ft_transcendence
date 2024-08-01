import styled from "styled-components";

const MatchCardContainer = styled.div`
	padding: 20px;
	margin: 10px;
	border-radius: 20px;
	background: ${({ $won }) => $won ? 'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(36,210,0,1) 100%)' : 'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(255,0,0,1) 100%)'};
`;

export default MatchCardContainer;
