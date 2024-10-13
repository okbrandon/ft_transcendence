import styled from 'styled-components';

const ProfilePicture = styled.img`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	margin-right: 10px;

	object-fit: cover;
	object-position: center;

	// if the image is located in header, it should be smaller
	${props => props.$header && `
		width: 30px;
		height: 30px;
	`}
`;

export default ProfilePicture;
