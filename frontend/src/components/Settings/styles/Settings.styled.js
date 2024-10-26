import styled from "styled-components";

export const PageContainer = styled.div`
	display: flex;
	gap: 3rem;
	width: 100vw;
	min-height: 100vh;
	padding: 100px;

	background-image: radial-gradient(circle at 20% 20%, rgba(75, 0, 130, 0.15), transparent 50%),
					  radial-gradient(circle at 80% 30%, rgba(59, 130, 246, 0.1), transparent 50%),
					  radial-gradient(circle at 50% 80%, rgba(164, 69, 178, 0.1), transparent 50%),
					  linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, transparent 100%);

	background-size: cover;
	background-position: center;
	border: 1px solid transparent;
`;

export const SideBar = styled.div`
	width: 25%;
	background-color: rgba(20, 20, 20, 0.5);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 15px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
`;

export const SidebarButton = styled.button`
	background: rgba(20, 20, 20, 0.1);
	border: 2px solid rgba(255, 255, 255, 0.1);
	border-radius: 10px;
	padding: 15px;
	color: #fff;
	text-align: left;
	width: 100%;
	cursor: pointer;
	transition: all 0.3s ease;
	font-size: 1.2rem;
	font-family: 'Orbitron', sans-serif;

	&:hover {
		background: rgba(50, 50, 50, 0.5);
		box-shadow: 0 0 2px rgba(164, 69, 178, 0.7);
		border-color: rgba(164, 69, 178, 0.2);
	}

	&.active {
		background-color: rgba(164, 69, 178, 0.1);
		border-color: rgba(164, 69, 178, 0.7);
	}
`;

export const SidebarBackButton = styled.button`
	background: rgba(100, 100, 100, 0.1);
	border: 2px solid rgba(255, 255, 255, 0.1);
	color: #fff;
	border-radius: 10px;
	padding: 15px;
	text-align: left;
	width: 100%;
	cursor: pointer;
	transition: all 0.3s ease;
	font-size: 1.2rem;
	font-family: 'Orbitron', sans-serif;
	display: flex;
	align-items: center;
	margin-top: 20px;

	&:hover {
		background: rgba(50, 50, 50, 0.5);
		box-shadow: 0 0 2px rgba(164, 69, 178, 0.7);
		border-color: rgba(164, 69, 178, 0.2);
	}

	&:active {
		background-color: rgba(164, 69, 178, 0.2);
		border-color: rgba(164, 69, 178, 0.9);
		color: #fff;
	}
`;

export const ContentArea = styled.div`
	flex: 1;
	padding: 30px;
	background-color: rgba(20, 20, 20, 0.5);
	border: 1px solid rgba(255, 255, 255, 0.1);
	color: #fff;
	border-radius: 10px;
	box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
	position: relative;
`;

export const Form = styled.form`
	width: 100%;
	display: flex;
	flex-direction: column;

	& > label {
		font-family: 'Inter', sans-serif;
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.7);
		margin-bottom: 0.5rem;
	}
`;

export const SectionHeading = styled.h2`
	font-family: 'Orbitron', sans-serif;
	font-size: 2rem;
	color: #fff;
	background: linear-gradient(135deg, #ff00ff, #00ffff);
	background-clip: text;
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	text-transform: uppercase;
`;

export const SubSectionHeading = styled.h3`
	font-family: 'Inter', sans-serif;
	font-size: 1.5rem;
	color: rgba(255, 255, 255, 0.9);
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	padding-bottom: 0.5rem;
	margin-bottom: 3rem;
	margin-top: 3rem;
`;

export const FormControlContainer = styled.div`
	position: relative;

	& > i {
		position: absolute;
		top: 10px;
		right: 15px;
		color: #fff;
		font-size: 1.5rem;
		z-index: 2;
		cursor: pointer;
	}
`;

export const FormInput = styled.input`
	width: 100%;
	padding: 1rem;
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 5px;
	background-color: rgba(25, 25, 25, 0.5);
	color: #fff;
	margin-bottom: 3.5rem;
	font-size: 1rem;
	transition: all 0.3s ease;

	&:focus {
		outline: none;
		border-color: rgba(164, 69, 178, 0.7);
		box-shadow: 0 0 10px rgba(164, 69, 178, 0.5);
	}

	&.is-invalid {
		background-color: rgba(255, 0, 0, 0.1);
	}
`;

export const BioContainer = styled.div`
	position: relative;

	& > p {
		position: absolute;
		right: 15px;
		bottom: 20px;
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.5);
	}
`;

export const TextArea = styled.textarea`
	width: 100%;
	padding: 1rem;
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 5px;
	background-color: rgba(25, 25, 25, 0.5);
	color: #fff;
	margin-bottom: 1.5rem;
	font-size: 1rem;
	transition: border-color 0.3s ease, box-shadow 0.3s ease;

	&:focus {
		outline: none;
		border-color: rgba(164, 69, 178, 0.7);
		box-shadow: 0 0 10px rgba(164, 69, 178, 0.5);
	}
`;
