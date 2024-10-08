import styled from 'styled-components';

export const ImageUploadContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	border: 2px dashed rgba(255, 255, 255, 0.3);
	border-radius: 15px;
	padding: 2rem;
	width: 100%;
	background: rgba(0, 0, 0, 0.2);
	transition: all 0.3s ease;
	margin-bottom: 4rem;

	&.dragover {
		background: rgba(164, 69, 178, 0.2);
	}
`;

export const ImageUploadLabel = styled.label`
	display: inline-block;
	padding: 1rem 2rem;
	background: linear-gradient(135deg, #6a0dad, #a445b2);
	color: #fff;
	border-radius: 10px;
	cursor: pointer;
	font-size: 1rem;
	transition: all 0.3s ease;
	box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);

	&:hover {
		background: linear-gradient(135deg, #a445b2, #d41872);
		transform: translateY(-2px);
		box-shadow: 0 4px 20px rgba(255, 255, 255, 0.3);
	}
`;

export const ImagePreviewContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 15px;
	border: 2px solid rgba(164, 69, 178, 0.5);
	overflow: hidden;
	box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
	background-color: #111;
	text-align: center;
	color: rgba(255, 255, 255, 0.3);

	&.profile-picture {
		width: 150px;
		height: 150px;
		border-radius: 50%;
	}

	&.banner-picture {
		width: 80%;
		height: 200px;
	}
`;

export const ImagePreview = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

export const ImageUploadInput = styled.input`
	display: none;
`;

