import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainBar from './main/MainBar';
import About from './content/About';
import MatchHistory from './content/MatchHistory';
import Winrate from './content/Winrate';
import { ProfileContainer, UserContainer, UserProfileBanner } from './styles/Profile.styled';
import Loader from '../../styles/shared/Loader.styled';
import DisplaySkin from './content/DisplaySkin';
import { GetUserFromRelation } from '../../api/friends';
import { GetUserByUsername } from '../../api/user';
import Notification from '../Notification/Notification';

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
	const [profileUser, setProfileUser] = useState(null);
	const [relation, setRelation] = useState(null);
	const userID = localStorage.getItem('userID');
	const notificationRef = useRef(null);

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
	}, [username, navigate]);

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
						<DisplaySkin profileUser={profileUser}/>
						<Winrate matchArray={matchArray}/>
						<MatchHistory matchArray={matchArray}/>
					</UserContainer>
				</>
			)}
		</ProfileContainer>
	);
};

export default Profile;
