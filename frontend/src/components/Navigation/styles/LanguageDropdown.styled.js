import styled from "styled-components";

export const LanguageDropdownButton = styled.select`
	padding: 0.3rem 0.4rem;
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 8px;
	background: rgba(0, 0, 0, 1);
	color: #fff;
	font-size: 0.9rem;
	font-family: "Poppins", sans-serif;
	transition: background 0.3s ease, border 0.3s ease;
	margin-left: 10px;

	&:hover {
		background: rgba(75, 0, 130, 0.6);
		cursor: pointer;
		border: 1px solid rgba(164, 69, 178, 0.6);
	}

	&:focus {
		outline: none;
	}

	option {
		background-color: rgba(25, 25, 25, 1);
		color: #fff;
		padding: 10px;
	}
`;
