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
} from "./styles/Visibility.styled";
import Loader from "../../styles/shared/Loader.styled";
import API from "../../api/api";
import logger from "../../api/logger";
import PongButton from "../../styles/shared/PongButton.styled";

const Visibility = () => {
	const [blockedUsers, setBlockedUsers] = useState(null);

	useEffect(() => {
		GetBlockedUsers()
			.then(users => {
				setBlockedUsers(users.filter(user => user.is === 'target'));
			});
	}, []);

	if (!blockedUsers) {
		return <Loader/>;
	}

	const handleUnblock = (e, relationID) => {
		e.preventDefault();
		API.delete(`users/@me/relationships/${relationID}`)
			.then(() => {
				logger('User unblocked');
				setBlockedUsers(blockedUsers.filter(user => user.relationID !== relationID));
			})
			.catch(err => {
				console.error(err.response.data.error);
			});
	};

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
							<PongButton onClick={e => handleUnblock(e, relation.relationID)}>
								Unblock
							</PongButton>
						</BlockedUserItem>
					))}
				</BlockedUserList>
			) : <p>No Blocked Users</p>}
		</Form>
	);
};

export default Visibility;
