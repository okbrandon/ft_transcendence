import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainBar from './main/MainBar';
import About from './content/About';
import API from '../../api/api'
import MatchHistory from './content/MatchHistory';
import Winrate from './content/Winrate';
import { ProfileContainer, UserContainer, UserProfileBanner } from './styles/Profile.styled';
import Loader from '../../styles/shared/Loader.styled';
import DisplaySkin from './content/DisplaySkin';
import { GetUserFromRelation } from '../../api/friends';
import { GetUserByUsername } from '../../api/user';
import Notification from '../Notification/Notification';
import { RelationContext } from '../../context/RelationContext';

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
	const { requests } = useContext(RelationContext);
	const [profileUser, setProfileUser] = useState(null);
	const [currentSkin, setCurrentSkin] = useState(null);
	const [relation, setRelation] = useState(null);
	const userID = localStorage.getItem('userID');
	const notificationRef = useRef(null);

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
		GetUserByUsername(username)
			.then(user => {
				setProfileUser(user);
				return GetUserFromRelation(user.username);
			})
			.then(relationData => {
				setRelation(relationData);
			})
			.catch(err => {
				console.error(err?.response?.data?.error || 'An error occurred.');
				navigate('/404');
			});
	}, [requests, username, navigate]);

	useEffect(() => {
		if (profileUser && relation && relation.length && relation[0].status === 2 && relation[0].target.userID === userID && profileUser.userID !== userID) {
			notificationRef.current.addNotification(
				'error',
				`An error occured.`
			);
		}
	}, [profileUser, relation, userID]);

	if (!profileUser || !relation) {
		return (
			<ProfileContainer>
				<Loader/>
			</ProfileContainer>
		);
	};

	return (
		<ProfileContainer>
			{(relation.length && relation[0].status === 2 && relation[0].target.userID === userID && profileUser.userID !== userID) ? (
				<>
					<Loader $profilePicture={profileUser.avatarID}/>
					<Notification ref={notificationRef}/>
				</>
			) : (
				<>
					<UserProfileBanner $path={profileUser.bannerID}/>
					<UserContainer>
						<MainBar profileUser={profileUser} matchArray={matchArray} relation={relation}/>
						<About profileUser={profileUser} matchArray={matchArray}/>
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
