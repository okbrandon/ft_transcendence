import styled from "styled-components";

export const FeaturedContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	position: relative;
	
	h1 {
		text-transform: uppercase;
		letter-spacing: 10px;
		font-family: 'Orbitron', sans-serif;
		margin: 50px 0;
	}

	.carousel {
		width: 100%;
		height: 600px;
		color: #fff;
		font-family: 'Poppins', sans-serif;
		font-size: 1.5rem;
		
		h2 {
			font-size: 3rem;
		}
	}

	.carousel-caption {
		text-align: center;
		height: 100%;
	}
`;
