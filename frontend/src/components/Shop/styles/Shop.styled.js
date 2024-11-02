import styled from "styled-components";

export const ShopContainer = styled.div`
	padding: 2rem;
	color: #fff;
	min-height: 100vh;
	background: radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.2), transparent 50%),
				radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2), transparent 50%),
				linear-gradient(135deg, #000000 0%, #111111 100%);
	background-size: cover;
	background-position: center;
`;

export const Header = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 80px auto 1rem auto;

	h1 {
		font-family: 'Orbitron', sans-serif;
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
	}
`;

export const SubtitleSection = styled.div`
	text-align: left;
	margin-bottom: 3rem;

	p {
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.65);
		margin: 0;
	}
`;

export const CoinsDisplay = styled.div`
	font-size: 1.5rem;
`;

export const SkinsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	gap: 2.5rem;
	margin-top: 1rem;
	margin-bottom: 2rem;
`;

export const SkinCard = styled.div`
	background: #1a1a1a;
	padding: 2rem;
	border-radius: 15px;
	box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.5);
	text-align: center;
	transition: all 0.3s ease;

	&:hover {
		transform: translateY(-5px);
		box-shadow: 0px 10px 30px rgba(164, 69, 178, 0.3);
	}
`;

export const SkinImage = styled.img`
	width: 100%;
	border-radius: 15px;
	margin-bottom: 1rem;
`;

export const SkinName = styled.h3`
	font-size: 1.3rem;
	font-family: 'Orbitron', sans-serif;
	margin-bottom: 0.5rem;
	text-transform: uppercase;
`;

export const SkinPrice = styled.p`
	font-size: 1rem;
	margin-bottom: 1rem;
`;

export const BuyButton = styled.button`
	background: linear-gradient(145deg, #5e35b1, #7e57c2);
	border: none;
	border-radius: 30px;
	padding: 0.8rem 1.8rem;
	font-size: 1.2rem;
	cursor: pointer;
	color: #fff;
	transition: all 0.3s ease;
	box-shadow: 0px 4px 15px rgba(164, 69, 178, 0.4);

	&:hover {
		background: linear-gradient(145deg, #7e57c2, #9575cd);
		box-shadow: 0px 6px 20px rgba(164, 69, 178, 0.6);
	}

	&.unequip {
		background: #555;
		box-shadow: none;
	}
	&.unequip:hover {
		background: #444;
		box-shadow: none;
	}
`;
