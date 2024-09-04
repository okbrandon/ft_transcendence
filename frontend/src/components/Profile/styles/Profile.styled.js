import styled from "styled-components";

export const ProfileContainer = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	min-height: 100vh;
	border: 1px solid transparent;
	background-color: #000;
	background-image: radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.15), transparent 50%),
					  radial-gradient(circle at 80% 30%, rgba(59, 130, 246, 0.1), transparent 50%),
					  radial-gradient(circle at 50% 80%, rgba(164, 69, 178, 0.1), transparent 50%),
					  linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, transparent 100%);

	background-size: cover;
	background-position: center;
`;

export const UserProfileBanner = styled.div`
	width: 75%;
	margin: 100px auto 0 auto;
	border-top-left-radius: 30px;
	border-top-right-radius: 30px;
	height: 250px;
	background-repeat: no-repeat;
	${props => props.$path ? `background-image: url(${props.$path});` : 'background-color: #111;'}
	background-size: cover;
	background-position: center;
`;

export const UserContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	top: 280px;
	left: 10%;
	width: 80%;
`;

export const CardTitle = styled.h2`
	padding: 20px 0;
	font-family: 'Orbitron', serif;
	font-size: 30px;
	font-weight: 600;
	text-align: center;
	width: 100%;
	border-bottom: 1px solid rgba(255, 255, 255, 0.5);
	border-radius: 30px 30px 0 0;
	background: linear-gradient(135deg, #a445b2, #d41872, #6a0dad);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	text-shadow: 0 0 10px rgba(164, 69, 178, 0.5), 0 0 15px rgba(128, 0, 128, 0.4);
	transition: all 0.3s ease-in-out;

	&:hover {
		text-shadow: 0 0 15px rgba(164, 69, 178, 0.7), 0 0 20px rgba(128, 0, 128, 0.6);
	}
`;
