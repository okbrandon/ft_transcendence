import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainBar from './main/MainBar';
import Balance from './content/Balance';
import MatchHistory from './content/MatchHistory';
import Winrate from './content/Winrate';
import DisplaySkin from './content/DisplaySkin';
import { getMatchHistory, getSkin, getUser, getUserById } from '../../api/user';
import { useRelation } from '../../context/RelationContext';
import { getRelationFromUsername } from '../../scripts/relation';
import { useNotification } from '../../context/NotificationContext';
import { ProfileContainer, UserContainer, UserInfoContainer, UserMainInfoContainer, UserProfileBanner, UserProfileBannerContainer } from './styles/Profile.styled';
import Loader from '../../styles/shared/Loader.styled';
import ProfileMainInfo from './main/ProfileMainInfo';
import Activity from './content/Activity';

const Profile = () => {
	const navigate = useNavigate();
	const { username } = useParams();
	const { addNotification } = useNotification();
	const { relations, setIsRefetch } = useRelation();
	const [profileUser, setProfileUser] = useState(null);
	const [currentSkin, setCurrentSkin] = useState(null);
	const [relation, setRelation] = useState(null);
	const [isBlocked, setIsBlocked] = useState(false);
	const [matches, setMatches] = useState(null);
	const userID = localStorage.getItem('userID');

	useEffect(() => {
		setIsRefetch(true);
	}, [setIsRefetch]);

	useEffect(() => {
		if (!profileUser) return;
		getMatchHistory(profileUser.userID, userID)
			.then(data => {
				setMatches(data);
			});
	}, [profileUser, userID]);

	// Get user data and relation data of the user
	useEffect(() => {
		if (username && relations) {
			getUserById(username)
				.then(user => {
					if (user.userID === userID) return getUser();
					return user;
				})
				.then(meUser => {
					setProfileUser(meUser);
					return getRelationFromUsername(relations, meUser.username);
				})
				.then(relationData => {
					setRelation(relationData);
				})
				.catch(err => {
					addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
					navigate('/404');
				});
		}
	}, [relations, username, navigate, addNotification, userID]);

	// Get selected skin of the user
	useEffect(() => {
		if (!profileUser) return;
		getSkin(profileUser.userID)
			.then(skin => {
				setCurrentSkin(skin)
			})
			.catch(err => {
				addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`)
			});
	}, [profileUser, addNotification]);

	// Check if the user is blocked
	useEffect(() => {
		if (relation && relation.length && relation[0].status === 2 && relation[0].target.userID === userID && profileUser.userID !== userID) {
			setIsBlocked(true);
			addNotification('error', 'An error occurred.');
		}
	}, [relation, profileUser, userID, addNotification]);

	if (!profileUser || !relation || !matches) {
		return (
			<ProfileContainer>
				<Loader/>
			</ProfileContainer>
		);
	}

	return (
		<ProfileContainer>
			{isBlocked ? (
				<Loader $profilePicture={profileUser.avatarID}/>
			) : (
				<>
					<UserProfileBannerContainer>
						<UserProfileBanner $path={profileUser.bannerID}/>
						<ProfileMainInfo
							profileUser={profileUser}
							relation={relation}
							setIsRefetch={setIsRefetch}/>
					</UserProfileBannerContainer>
					<MainBar profileUser={profileUser} matches={matches}/>
					<UserContainer>
						<UserMainInfoContainer>
							<MatchHistory matches={matches}/>
							<Activity matches={matches}/>
						</UserMainInfoContainer>
						<UserInfoContainer>
							<Winrate matches={matches}/>
							<DisplaySkin currentSkin={currentSkin}/>
							{profileUser.userID === userID && (
								<Balance profileUser={profileUser}/>
							)}
						</UserInfoContainer>
					</UserContainer>
				</>
			)}
		</ProfileContainer>
	);
};

export default Profile;
