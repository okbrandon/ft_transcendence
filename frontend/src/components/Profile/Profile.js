import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainBar from './main/MainBar';
import Balance from './content/Balance';
import API from '../../api/api'
import MatchHistory from './content/MatchHistory';
import Winrate from './content/Winrate';
import DisplaySkin from './content/DisplaySkin';
import { GetUser, GetUserByUsername } from '../../api/user';
import { useRelation } from '../../context/RelationContext';
import { GetUserFromRelation } from '../../scripts/relation';
import { useNotification } from '../../context/NotificationContext';
import { ProfileContainer, UserContainer, UserInfoContainer, UserProfileBanner, UserProfileBannerContainer } from './styles/Profile.styled';
import Loader from '../../styles/shared/Loader.styled';
import ProfileMainInfo from './main/ProfileMainInfo';
import Activity from './content/Activity';

const matchArray = [
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Brandon"}, scores: {playerA: 9, playerB: 10}, startedAt: "2021-09-01T12:28:01Z", finishedAt: "2021-09-01T12:30:38Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Evan"}, scores: {playerA: 10, playerB: 8}, startedAt: "2021-09-01T12:31:08Z", finishedAt: "2021-09-01T12:35:40Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Kian"}, scores: {playerA: 10, playerB: 9}, startedAt: "2021-09-01T12:38:48Z", finishedAt: "2021-09-01T12:40:51Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Brandon"}, scores: {playerA: 9, playerB: 10}, startedAt: "2021-09-01T12:28:01Z", finishedAt: "2021-09-01T12:30:38Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Evan"}, scores: {playerA: 10, playerB: 8}, startedAt: "2021-09-01T12:31:08Z", finishedAt: "2021-09-01T12:35:40Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Kian"}, scores: {playerA: 10, playerB: 9}, startedAt: "2021-09-01T12:38:48Z", finishedAt: "2021-09-01T12:40:51Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Brandon"}, scores: {playerA: 9, playerB: 10}, startedAt: "2021-09-01T12:28:01Z", finishedAt: "2021-09-01T12:30:38Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Evan"}, scores: {playerA: 10, playerB: 8}, startedAt: "2021-09-01T12:31:08Z", finishedAt: "2021-09-01T12:35:40Z"},
];

const Profile = () => {
	const navigate = useNavigate();
	const { username } = useParams();
	const { addNotification } = useNotification();
	const { relations, setIsRefetch } = useRelation();
	const [profileUser, setProfileUser] = useState(null);
	const [currentSkin, setCurrentSkin] = useState(null);
	const [relation, setRelation] = useState(null);
	const [isBlocked, setIsBlocked] = useState(false);
	const userID = localStorage.getItem('userID');

	useEffect(() => {
		setIsRefetch(true);
	}, [setIsRefetch]);

	useEffect(() => {
		if (username && relations) {
			GetUserByUsername(username)
				.then(user => {
					if (user.userID === userID) return GetUser();
					return user;
				})
				.then(meUser => {
					setProfileUser(meUser);
					return GetUserFromRelation(relations, meUser.username);
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

	useEffect(() => {
		if (!profileUser) return;
		let selectedSkinId;
		API.get(`/users/${profileUser.userID}/settings`)
			.then(response => {
				selectedSkinId = response.data.selectedPaddleSkin;
				if (selectedSkinId) {
					return API.get('/store/items');
				}
				setCurrentSkin(null);
				return null;
			})
			.then(response => {
				if (!response) return;
				const selectedSkin = response.data.find(item => item.itemID === selectedSkinId);
				if (selectedSkin) {
					setCurrentSkin(selectedSkin.assetID);
				} else {
					setCurrentSkin(null);
				}
			})
			.catch(err => {
				addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
			});
	}, [addNotification, profileUser]);

	useEffect(() => {
		if (relation) {
			setIsBlocked(relation.length && relation[0].status === 2 && relation[0].target.userID === userID && profileUser.userID !== userID);
		}
	}, [relation, profileUser, userID]);

	useEffect(() => {
		if (isBlocked) {
			addNotification('error', 'An error occurred.');
		}
	}, [isBlocked, addNotification]);

	if (!profileUser || !relation) {
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
					<MainBar profileUser={profileUser} matchArray={matchArray}/>
					<UserContainer>
						<MatchHistory matchArray={matchArray}/>
						<Activity matchArray={matchArray}/>
						<UserInfoContainer>
							<Winrate matchArray={matchArray}/>
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
