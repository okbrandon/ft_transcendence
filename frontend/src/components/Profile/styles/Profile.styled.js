import styled from "styled-components";

export const ProfileContainer = styled.div`
	position: relative;
	width: 100%;
	height: 1800px;
	border: 1px solid transparent;
	background-color: #000;
	background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
		radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
	background-position: 0 0, 25px 25px;
	background-size: 50px 50px;
`;

export const UserProfileBanner = styled.div`
	width: 75%;
	margin: 100px auto 0 auto;
	border-radius: 30px;
	height: 300px;
	background-repeat: no-repeat;
	${props => props.$path ? `background-image: url(${props.$path});` : 'background-color: #111;'}
	background-size: cover;
	background-position: center;
`;

export const UserContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	position: absolute;
	top: 280px;
	left: 10%;
	width: 80%;
`;

export const CardTitle = styled.h2`
	padding: 20px 0;
	font-family: 'Orbitron', serif;
	font-size: 30px;
	font-weight: 600;
	margin: 0 auto;
	text-align: center;
	width: 100%;
	border-bottom: 1px solid rgba(255,255,255,0.5);
	border-radius: 30px 30px 0 0;
	background: #000;
`;
