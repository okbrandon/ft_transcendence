import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainBar from './main/MainBar';
import About from './content/About';
import MatchHistory from './content/MatchHistory';
import Winrate from './content/Winrate';
import { ProfileContainer, UserContainer, UserProfileBanner } from './styles/Profile.styled';
import Loader from '../../styles/shared/Loader.styled';
import DisplaySkin from './content/DisplaySkin';
import { GetUserByUsername } from '../../api/user';
import Notification from '../Notification/Notification';
import { RelationContext } from '../../context/RelationContext';
import { GetUserFromRelation } from '../../scripts/relation';

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
	const { relations, setIsRefetch } = useContext(RelationContext);
	const [profileUser, setProfileUser] = useState(null);
	const [relation, setRelation] = useState(null);
	const [isBlocked, setIsBlocked] = useState(false);
	const userID = localStorage.getItem('userID');
	const notificationRef = useRef(null);

	useEffect(() => {
		setIsRefetch(true);
	}, [setIsRefetch]);

	useEffect(() => {
		if (username && relations) {
			GetUserByUsername(username)
				.then(user => {
					setProfileUser(user);
					return GetUserFromRelation(relations, user.username);
				})
				.then(relationData => {
					setRelation(relationData);
				})
				.catch(err => {
					console.error(err?.response?.data?.error || 'An error occurred.');
					navigate('/404');
			});
		}
	}, [relations, username, navigate]);

	useEffect(() => {
		if (relation) {
			setIsBlocked(relation.length && relation[0].status === 2 && relation[0].target.userID === userID && profileUser.userID !== userID);
		}
	}, [relation, profileUser, userID]);

	useEffect(() => {
		if (isBlocked) {
			notificationRef.current.addNotification(
				'error',
				`An error occured.`
			);
		}
	}, [isBlocked]);

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
				<>
					<Loader $profilePicture={profileUser.avatarID}/>
					<Notification ref={notificationRef}/>
				</>
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
