import React, { useContext, useEffect } from 'react';
import { ProfileContainer, UserContainer, UserProfileBanner } from '../../styles/Profile/Profile.styled';
import User from './main/User';
import Loader from '../../styles/shared/Loader.styled';
import ProfileProvider, { ProfileContext } from '../../context/ProfileContext';
import About from './content/About';
import MatchHistory from './content/MatchHistory';
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
	{playerA: {displayName: "hanmin"}, playerB: {displayName: "Kian"}, scores: {playerA: 10, playerB: 9}, startedAt: "2021-09-01T12:38:48Z", finishedAt: "2021-09-01T12:40:51Z"},
];

export const ProfileParent = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<ProfileProvider>
			<Profile/>
		</ProfileProvider>
	);
};

const Profile = () => {
	const { loading, user } = useContext(ProfileContext);

	return (
		<ProfileContainer>
			{
				loading ? <Loader/> : (
					<>
						<UserProfileBanner $path=""/>
						<UserContainer>
							<User user={user} matchArray={matchArray}/>
							<About user={user} matchArray={matchArray}/>
							<Activity matchArray={matchArray}/>
							<MatchHistory matchArray={matchArray}/>
						</UserContainer>
					</>
				)
			}
		</ProfileContainer>
	);
};

export default Profile;
