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
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
	const navigate = useNavigate();
	const { username } = useParams();
	const { addNotification } = useNotification();
	const { relations, isRefetch, setIsRefetch } = useRelation();
	const { user } = useAuth();
	const [hasRefetched, setHasRefetched] = useState(false);
	const [showLoader, setShowLoader] = useState(true);
	const [profileUser, setProfileUser] = useState(null);
	const [currentSkin, setCurrentSkin] = useState(null);
	const [relation, setRelation] = useState(null);
	const [isBlocked, setIsBlocked] = useState(false);
	const [matches, setMatches] = useState(null);

	useEffect(() => {
		setIsRefetch(true);
		setHasRefetched(true);
		setShowLoader(true);
	}, [setIsRefetch, username]);

	useEffect(() => {
		const fetchProfileData = async () => {
			try {
				if (username && relations && hasRefetched && !isRefetch) {
					let profilePageUser = null;
					if (user.username === username) {
						profilePageUser = await getUser();
					} else {
						profilePageUser = await getUserById(username);
					}

					setProfileUser(profilePageUser);

					const relationData = getRelationFromUsername(relations, profilePageUser.username);
					setRelation(relationData);

					const matchData = await getMatchHistory(profilePageUser.userID);
					setMatches(matchData);
					setShowLoader(false);
				}
			} catch (err) {
				addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
				navigate('/404');
			}
		};

		fetchProfileData();
	}, [addNotification, navigate, relations, username, isRefetch, hasRefetched, user]);

	// Get selected skin of the user
	useEffect(() => {
		if (profileUser) {
			getSkin(profileUser.userID)
				.then(skin => setCurrentSkin(skin))
				.catch(err => addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`));
		}
	}, [profileUser, addNotification]);

	// Check if the user is blocked
	useEffect(() => {
		if (relation && relation.length && relation[0].status === 2 && relation[0].target.username === user.username && profileUser.username !== user.username) {
			setIsBlocked(true);
			addNotification('error', 'An error occurred.');
		}
	}, [relation, profileUser, user, addNotification]);

	if (showLoader) {
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
							user={user}
							profileUser={profileUser}
							relation={relation}
						/>
					</UserProfileBannerContainer>
					<MainBar profileUser={profileUser} matches={matches}/>
					<UserContainer>
						<UserMainInfoContainer>
							<MatchHistory
								userID={profileUser.userID}
								matches={matches}
							/>
							<Activity matches={matches}/>
						</UserMainInfoContainer>
						<UserInfoContainer>
							<Winrate userID={profileUser.userID} matches={matches}/>
							<DisplaySkin currentSkin={currentSkin}/>
							{profileUser?.username === user?.username && (
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
