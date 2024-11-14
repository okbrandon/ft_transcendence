import styled from "styled-components";

export const PrivacySection = styled.section`
	min-height: 100vh;
	width: 100vw;
	padding-top: 120px;
	padding-bottom: 100px;
	background: radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.2), transparent 50%),
				radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2), transparent 50%),
				linear-gradient(135deg, #000000 0%, #111111 100%);

	& > i {
		position: relative;
		left: 50px;
		font-size: 2rem;

		&:hover {
			cursor: pointer;
			color: rgba(255, 255, 255, 0.8);
		}
	}
`;

export const PrivacyContainer = styled.div`
	width: 80%;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	background-color: rgba(255, 255, 255, 0.05);
	padding: 70px;
	border-radius: 25px;
	border: 1px solid rgba(255, 255, 255, 0.05);
	position: relative;

	& > h1 {
		font-family: "Orbitron", sans-serif;
		font-size: 3rem;
		letter-spacing: 4px;
		color: #fff;
		background: linear-gradient(135deg, #ff00ff, #00ffff);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-shadow:
			0 0 10px rgba(255, 255, 255, 0.6),
			0 0 15px rgba(128, 0, 128, 0.4),
			0 0 20px rgba(75, 0, 130, 0.3);
		margin-bottom: 30px;
	}

	& > h2 {
		font-size: 1.6rem;
		font-style: italic;
		color: rgba(255, 255, 255, 0.8);
	}
`;

export const HeaderContent = styled.div`
	color: rgba(255, 255, 255, 0.8);
	font-family: 'Inter', sans-serif;
	font-size: 1.3rem;
	margin: 20px 0 80px 0;
`;

export const PrivacyContent = styled.div`
	width: 80%;
	margin: 0 auto;
	color: rgba(255, 255, 255, 0.8);
	font-family: 'Inter', sans-serif;

	& > .divider {
		margin-bottom: 50px;
	}

	& h3 {
		color: rgba(255, 255, 255, 0.85);
		margin-bottom: 35px;
	}

	& p {
		margin-left: 20px;
		font-size: 1.1rem;
	}

	& span {
		font-weight: bold;

		&:hover {
			cursor: pointer;
			text-decoration: underline;
		}
	}
`;
