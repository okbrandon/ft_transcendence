import styled from "styled-components";

export const ProfileContainer = styled.div`
	position: relative;
	width: 100%;
	height: 1800px;
	border: 1px solid transparent;

	--color: rgba(20, 20, 20, 0.4);
	background-color: rgb(2,2,2);
	background-image: linear-gradient(0deg, transparent 24%, var(--color) 25%, var(--color) 26%, transparent 27%,transparent 74%, var(--color) 75%, var(--color) 76%, transparent 77%,transparent),
		linear-gradient(90deg, transparent 24%, var(--color) 25%, var(--color) 26%, transparent 27%,transparent 74%, var(--color) 75%, var(--color) 76%, transparent 77%,transparent);
	background-size: 55px 55px;
`;

export const UserProfileBanner = styled.div`
	width: 75%;
	margin: 100px auto 0 auto;
	border-radius: 30px;
	height: 300px;
	background-repeat: no-repeat;
	background: url(${(props) => props.$path ? props.$path : '/images/profilebg.jpg'});
	background-size: auto;
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
