import styled from "styled-components";

export const ShopContainer = styled.div`
	padding: 2rem;
	background: #111;
	color: #fff;
	min-height: 100vh;
	text-align: center;
	margin-top: 80px;
`;

export const CoinsDisplay = styled.div`
	font-size: 1.5rem;
	margin-bottom: 2rem;
`;

export const SkinsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 2rem;
`;

export const SkinCard = styled.div`
	background: #222;
	padding: 1.5rem;
	border-radius: 15px;
	box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
	text-align: center;
	transition: all 0.3s ease;

	&:hover {
		transform: translateY(-5px);
		box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.7);
	}
`;

export const SkinImage = styled.img`
	width: 100%;
	border-radius: 10px;
	margin-bottom: 1rem;
`;

export const SkinDetails = styled.div`
	font-family: "Press Start 2P", sans-serif;
`;

export const SkinName = styled.h3`
	font-size: 1.2rem;
	margin-bottom: 0.5rem;
`;

export const SkinPrice = styled.p`
	font-size: 1rem;
	margin-bottom: 1rem;
`;

export const BuyButton = styled.button`
	background: linear-gradient(145deg, #00ff88, #00cc77);
	border: none;
	border-radius: 20px;
	padding: 0.5rem 1.5rem;
	font-size: 1rem;
	cursor: pointer;
	color: #fff;
	transition: all 0.3s ease;
	box-shadow: 0px 4px 15px rgba(0, 255, 136, 0.3);

	&:hover {
		background: linear-gradient(145deg, #00cc77, #00ff88);
		box-shadow: 0px 6px 20px rgba(0, 255, 136, 0.5);
	}

	&:disabled {
		background: #555;
		cursor: not-allowed;
		box-shadow: none;
	}
`;
