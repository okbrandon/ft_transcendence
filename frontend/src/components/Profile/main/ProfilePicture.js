import React from 'react';
import { ProfileImage, ProfilePictureContainer, ProfilePictureLayout } from '../../../styles/Profile/main/ProfilePicture.styled';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const ProfilePicture = ({ user }) => {
	return (
		<ProfilePictureLayout>
			<ProfilePictureContainer>
				<ProfileImage
					src={user.avatarID !== 'default' ? user.avatarID : '/images/anonymous.png'}
					alt='profile picture'
					roundedCircle
				/>
				<div>
					<CircularProgressbar
						value={20}
						strokeWidth={4}
						styles={buildStyles({
							rotation: 0.5,
							pathColor: `#64ff61`,
							trailColor: 'rgba(255,255,255,0.4)',
						})}
					/>
				</div>
				<p>0</p>
			</ProfilePictureContainer>
			<h2>{ user.displayName ? user.displayName : '' }</h2>
		</ProfilePictureLayout>
	);
};

export default ProfilePicture;
