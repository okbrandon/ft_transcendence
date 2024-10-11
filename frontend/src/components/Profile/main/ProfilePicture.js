import React from 'react';
import { ProfileImage, ProfilePictureContainer, SectionContainer } from '../styles/main/ProfilePicture.styled';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const ProfilePicture = ({ profileUser }) => {
	return (
		<SectionContainer>
			<ProfilePictureContainer>
				<ProfileImage
					src={profileUser.avatarID}
					alt={`${profileUser.username}'s avatar`}
					roundedCircle
				/>
				<div>
					<CircularProgressbar
						value={20}
						strokeWidth={4}
						styles={buildStyles({
							rotation: 0.5,
							pathColor: `#FFD700`,
							trailColor: 'rgba(255,255,255,0.4)',
						})}
					/>
				</div>
				<p>0</p>
			</ProfilePictureContainer>
			<h2>{profileUser.displayName}</h2>
			<h3>{profileUser.username}</h3>
		</SectionContainer>
	);
};

export default ProfilePicture;
