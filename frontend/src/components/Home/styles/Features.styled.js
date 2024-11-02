import styled from "styled-components";

export const FeaturesSection = styled.section`
	position: relative;
	width: 80%;
	margin: 0 auto 50px auto;
	display: grid;
	grid-template-columns: repeat(3, minmax(200px, 350px));
	justify-content: center;
	align-items: center;
	gap: 50px;
`;

export const Line = styled.hr`
	position: absolute;
	top: 50%;
	transform: translateY(-100%);
	width: 100%;
	border: none;
	height: 4px;
	background: linear-gradient(
		90deg,
		transparent 0%,
		rgba(255,255,255,0.2) 20%,
		rgba(255,255,255,1) 40%,
		rgba(255,255,255,1) 60%,
		rgba(255,255,255,0.2) 80%,
		transparent 100%);
	opacity: 1;
	z-index: -1;
`;

export const FeatureItem = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 20px;
	background-color: rgba(10, 10, 10, 1);
	padding: 20px 0;
	border-radius: 10px;
	box-shadow: 0 4px 15px rgba(164, 69, 178, 0.5), 0 0 15px rgba(59, 130, 246, 0.5);
	transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
	border: 1px solid rgba(164, 69, 178, 0.3);
	position: relative;

	h3 {
		font-family: 'Orbitron', sans-serif;
		font-size: 24px;
		color: #fff;
		margin-bottom: 10px;
		text-shadow: 0 0 5px rgba(164, 69, 178, 0.7);
	}

	i {
		font-size: 40px;
	}
`;

export const Teaser = styled.h3`
	font-family: 'Orbitron', sans-serif;
	font-size: 24px;
	color: rgba(255,255,255,0.8);
	margin-bottom: 150px;
	text-align: center;
`;
