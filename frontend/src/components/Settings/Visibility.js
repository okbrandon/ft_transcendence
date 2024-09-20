import React, { useEffect, useState } from "react";
import { GetBlockedUsers } from "../../api/friends";
import {
	Form,
	SectionHeading,
	SubSectionHeading
} from "./styles/Settings.styled";
import {
	BlockedUserAvatar,
	BlockedUserItem,
	BlockedUserList,
	BlockedUserName,
	UnblockButton
} from "./styles/Visibility.styled";
import Loader from "../../styles/shared/Loader.styled";
import API from "../../api/api";
import logger from "../../api/logger";

const Visibility = () => {
	const [blockedUsers, setBlockedUsers] = useState(null);

	useEffect(() => {
		GetBlockedUsers()
			.then(res => {
				setBlockedUsers(res);
			});
	}, []);

	if (!blockedUsers) {
		return <Loader/>;
	}

	const handleUnblock = (e, targetID) => {
		e.preventDefault();
		API.put('users/@me/relationships', { user: targetID, type: 1 })
			.then(() => {
				logger('User unblocked');
				setBlockedUsers(blockedUsers.filter(user => user.userB !== targetID));
			})
			.catch(err => {
				console.error(err.response.data.error);
			});
	};

	console.log('Blocked Users:', blockedUsers);

	return (
		<Form>
			<SectionHeading>Visibility</SectionHeading>
			<SubSectionHeading>Blocked Users</SubSectionHeading>
			{blockedUsers.length ? (
				<BlockedUserList>
					{blockedUsers.map((relation, id) => (
						<BlockedUserItem key={id}>
							<div>
								<BlockedUserAvatar src='/images/default-profile.png' alt={'Blocked user'}/>
								<BlockedUserName>{relation.displayName}</BlockedUserName>
							</div>
							<UnblockButton onClick={e => handleUnblock(e, relation.userB)}>
								Unblock
							</UnblockButton>
						</BlockedUserItem>
					))}
				</BlockedUserList>
			) : <p>No Blocked Users</p>}
		</Form>
	);
};

export default Visibility;
