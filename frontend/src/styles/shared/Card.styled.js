import styled from 'styled-components';

const Card = styled.div`
	background-color: rgba(255, 255, 255, 0.2);
	color: rgba(255, 255, 255, 0.8);
	width: ${({ $width }) => $width};
	height: ${({ $height }) => $height};
	border-radius: 10px;
	padding: 15px;
	margin: 10px auto;
	margin-top: 25px;
	text-align: center;
	box-shadow: 0 2px 5px rgba(0,0,0,0.1);
	position: relative;
	z-index: 10;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: 1.2rem;

	p {
		margin: 5px 0;
	}

	img {
		width: 90px;
		height: 90px;
		border-radius: 50%;
		object-fit: cover;
	}

	h3 {
		font-family: 'Orbitron', sans-serif;
		margin: 10px 0 20px 0;
		margin-bottom: 20px;
		font-size: 1.5rem;
	}

	button {
		font-size: 1.1rem;
		margin: 5px;
		padding: 10px 20px;
		border: none;
		border-radius: 50px;
		cursor: pointer;
		transition: background-color 0.3s ease;
		background-color: #6a0dad;
		color: #fff;

		&:hover {
			background-color: #4a0a9d;
		}
	}

	.bg {
		position: absolute;
		top: 3px;
		left: 3px;
		width: calc(100% - 6px);
		height: calc(100% - 6px);
		z-index: 2;
		background: rgba(20, 20, 20, 1);
		backdrop-filter: blur(24px);
		border-radius: 10px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;

		& > .button-container {
			width: 100%;
			display: flex;
			justify-content: center;
			gap: 10px;
			margin: 10px 0;
		}
	}

	@keyframes blob-bounce {
		0% {
			transform: translate(-100%, -100%) translate3d(0, 0, 0);
		}

		25% {
			transform: translate(-100%, -100%) translate3d(100%, 0, 0);
		}

		50% {
			transform: translate(-100%, -100%) translate3d(100%, 100%, 0);
		}

		75% {
			transform: translate(-100%, -100%) translate3d(0, 100%, 0);
		}

		100% {
			transform: translate(-100%, -100%) translate3d(0, 0, 0);
		}
	}

	.blob {
		position: absolute;
		z-index: 1;
		top: 50%;
		left: 50%;
		width: 200px;
		height: 200px;
		border-radius: 50%;
		background-color: #6a0dad;
		opacity: 1;
		filter: blur(12px);
		animation: blob-bounce 5s infinite ease;
	}
`;

export default Card;
