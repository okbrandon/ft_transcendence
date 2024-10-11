import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainBar from './main/MainBar';
import About from './content/About';
import API from '../../api/api'
import MatchHistory from './content/MatchHistory';
import Winrate from './content/Winrate';
import DisplaySkin from './content/DisplaySkin';
import { GetUser, GetUserByUsername } from '../../api/user';
import { useRelation } from '../../context/RelationContext';
import { GetUserFromRelation } from '../../scripts/relation';
import { useNotification } from '../../context/NotificationContext';
import { ProfileContainer, UserContainer, UserProfileBanner } from './styles/Profile.styled';
import Loader from '../../styles/shared/Loader.styled';

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
		let selectedSkinId;
		API.get('/users/@me/settings')
			.then(response => {
				selectedSkinId = response.data.selectedPaddleSkin;
				if (selectedSkinId) {
					return API.get('/store/items');
				}
				return Promise.reject('No skin selected');
			})
			.then(response => {
				const selectedSkin = response.data.find(item => item.itemID === selectedSkinId);
				if (selectedSkin) {
					setCurrentSkin(selectedSkin.assetID);
				}
			})
			.catch(error => console.error('Error fetching skin:', error));
	}, []);

	useEffect(() => {
		setIsRefetch(true);
	}, [setIsRefetch]);

	useEffect(() => {
		if (username && relations) {
			GetUserByUsername(username)
				.then(user => {
					if (user.userID === userID) {
						GetUser()
							.then(meUser => {
								setProfileUser(meUser);
							})
							.catch(err => {
								addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
								navigate('/404');
							});
					} else {
						setProfileUser(user);
					}
					return GetUserFromRelation(relations, user.username);
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
	};

	return (
		<ProfileContainer>
			{isBlocked ? (
				<Loader $profilePicture={profileUser.avatarID}/>
			) : (
				<>
					<UserProfileBanner $path={profileUser.bannerID}/>
					<UserContainer>
						<MainBar
							profileUser={profileUser}
							matchArray={matchArray}
							relation={relation}
							setIsRefetch={setIsRefetch}
						/>
						<About
							profileUser={profileUser}
							matchArray={matchArray}
						/>
						<DisplaySkin currentSkin={currentSkin}/>
						<Winrate matchArray={matchArray}/>
						<MatchHistory matchArray={matchArray}/>
					</UserContainer>
				</>
			)}
		</ProfileContainer>
	);
};

export default Profile;
