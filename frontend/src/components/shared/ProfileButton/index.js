import React from 'react';
import StyledProfileButton, { ProfileDropdownLink } from '../../styles/shared/button/ProfileButton.styled';
import Dropdown from 'react-bootstrap/Dropdown';

const ProfileButton = () => {
	return (
		<StyledProfileButton id="dropdown-basic-button" title="Profile">
			<Dropdown.Item>
				<ProfileDropdownLink to="/home">Profile</ProfileDropdownLink>
			</Dropdown.Item>
			<Dropdown.Item>
				<ProfileDropdownLink to="/home">Edit</ProfileDropdownLink>
			</Dropdown.Item>
			<Dropdown.Divider/>
			<Dropdown.Item>
				<ProfileDropdownLink to="/">Logout</ProfileDropdownLink>
			</Dropdown.Item>
		</StyledProfileButton>
	);
};

export default ProfileButton;
