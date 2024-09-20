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

	const handleUnblock = (relationID) => {

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
								<BlockedUserAvatar src={relation.avatarID && relation.avatarID !== 'default' ? relation.avatarID : '/images/default-profile.png'} alt={`${relation.displayName}'s avatar`}/>
								<BlockedUserName>{relation.displayName}</BlockedUserName>
							</div>
							<UnblockButton onClick={() => handleUnblock(relation.relationshipID)}>
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
