import React from "react";
import { BlockedProfileContainer, BlockedProfilePicture } from "./styles/BlockedProfile.styled";

const BlockedProfile = () => {
	return (
		<BlockedProfileContainer>
			<BlockedProfilePicture src='/images/default-profile.png' alt='Blocked user'/>
		</BlockedProfileContainer>
	);
};

export default BlockedProfile;
