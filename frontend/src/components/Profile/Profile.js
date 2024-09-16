import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainBar from './main/MainBar';
import About from './content/About';
import MatchHistory from './content/MatchHistory';
import Winrate from './content/Winrate';
import { ProfileContainer, UserContainer, UserProfileBanner } from './styles/Profile.styled';
import Loader from '../../styles/shared/Loader.styled';
import ProfileProvider, { ProfileContext } from '../../context/ProfileContext';
import DisplaySkin from './content/DisplaySkin';

const matchArray = [
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Brandon"}, scores: {playerA: 9, playerB: 10}, startedAt: "2021-09-01T12:28:01Z", finishedAt: "2021-09-01T12:30:38Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Evan"}, scores: {playerA: 10, playerB: 8}, startedAt: "2021-09-01T12:31:08Z", finishedAt: "2021-09-01T12:35:40Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Kian"}, scores: {playerA: 10, playerB: 9}, startedAt: "2021-09-01T12:38:48Z", finishedAt: "2021-09-01T12:40:51Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Brandon"}, scores: {playerA: 9, playerB: 10}, startedAt: "2021-09-01T12:28:01Z", finishedAt: "2021-09-01T12:30:38Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Evan"}, scores: {playerA: 10, playerB: 8}, startedAt: "2021-09-01T12:31:08Z", finishedAt: "2021-09-01T12:35:40Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Kian"}, scores: {playerA: 10, playerB: 9}, startedAt: "2021-09-01T12:38:48Z", finishedAt: "2021-09-01T12:40:51Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Brandon"}, scores: {playerA: 9, playerB: 10}, startedAt: "2021-09-01T12:28:01Z", finishedAt: "2021-09-01T12:30:38Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Evan"}, scores: {playerA: 10, playerB: 8}, startedAt: "2021-09-01T12:31:08Z", finishedAt: "2021-09-01T12:35:40Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Kian"}, scores: {playerA: 10, playerB: 9}, startedAt: "2021-09-01T12:38:48Z", finishedAt: "2021-09-01T12:40:51Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Brandon"}, scores: {playerA: 9, playerB: 10}, startedAt: "2021-09-01T12:28:01Z", finishedAt: "2021-09-01T12:30:38Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Evan"}, scores: {playerA: 10, playerB: 8}, startedAt: "2021-09-01T12:31:08Z", finishedAt: "2021-09-01T12:35:40Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Kian"}, scores: {playerA: 10, playerB: 9}, startedAt: "2021-09-01T12:38:48Z", finishedAt: "2021-09-01T12:40:51Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Brandon"}, scores: {playerA: 9, playerB: 10}, startedAt: "2021-09-01T12:28:01Z", finishedAt: "2021-09-01T12:30:38Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Evan"}, scores: {playerA: 10, playerB: 8}, startedAt: "2021-09-01T12:31:08Z", finishedAt: "2021-09-01T12:35:40Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Kian"}, scores: {playerA: 10, playerB: 9}, startedAt: "2021-09-01T12:38:48Z", finishedAt: "2021-09-01T12:40:51Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Brandon"}, scores: {playerA: 9, playerB: 10}, startedAt: "2021-09-01T12:28:01Z", finishedAt: "2021-09-01T12:30:38Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Evan"}, scores: {playerA: 10, playerB: 8}, startedAt: "2021-09-01T12:31:08Z", finishedAt: "2021-09-01T12:35:40Z"},
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Kian"}, scores: {playerA: 10, playerB: 9}, startedAt: "2021-09-01T12:38:48Z", finishedAt: "2021-09-01T12:40:51Z"},
];

export const ProfileParent = () => {
	const { username } = useParams();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<ProfileProvider username={username}>
			<Profile/>
		</ProfileProvider>
	);
};

const Profile = () => {
	const { loading, profileUser } = useContext(ProfileContext);

	if (loading) {
		return (
			<ProfileContainer>
				<Loader/>
			</ProfileContainer>
		);
	};

	return (
		<ProfileContainer>
			<UserProfileBanner $path={profileUser.bannerID || '/images/default-banner.png'}/>
			<UserContainer>
				<MainBar profileUser={profileUser} matchArray={matchArray}/>
				<About profileUser={profileUser} matchArray={matchArray}/>
				<DisplaySkin profileUser={profileUser}/>
				<Winrate matchArray={matchArray}/>
				<MatchHistory matchArray={matchArray}/>
			</UserContainer>
		</ProfileContainer>
	);
};

export default Profile;
