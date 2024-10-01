import React, { useContext, useEffect, useState } from "react";
import API from "../../api/api";
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
import PongButton from "../../styles/shared/PongButton.styled";
import { RelationContext } from "../../context/RelationContext";

const Visibility = () => {
	const { blockedUsers, setIsRefetch, setSendNotification } = useContext(RelationContext);

	if (!blockedUsers) return <Loader/>;

	const handleUnblock = (e, relationID) => {
		e.preventDefault();
		API.delete(`users/@me/relationships/${relationID}`)
			.then(() => {
				setSendNotification({ type: 'success', message: 'User unblocked' });
				setIsRefetch(true);
			})
			.catch(err => {
				setSendNotification({ type: 'error', message: `${err?.response?.data?.error || 'An error occurred.'}` });
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
