import React from "react";
import API from "../../api/api";
import { useRelation } from "../../context/RelationContext";
import { useNotification } from "../../context/NotificationContext";
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
import { useTranslation } from "react-i18next";

const Visibility = () => {
	const { blockedUsers, setIsRefetch } = useRelation();
	const { addNotification } = useNotification();
	const { t } = useTranslation();

	if (!blockedUsers) return <Loader/>;

	const handleUnblock = (e, relationID) => {
		e.preventDefault();
		API.delete(`users/@me/relationships/${relationID}`)
			.then(() => {
				addNotification('success', 'User unblocked');
				setIsRefetch(true);
			})
			.catch(err => {
				addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
			});
	};

	return (
		<Form>
			<SectionHeading>{t('settings.visibility.title')}</SectionHeading>
			<SubSectionHeading>{t('settings.visibility.subSections.blockedUsers.title')}</SubSectionHeading>
			{blockedUsers.length ? (
				<BlockedUserList>
					{blockedUsers.map((relation, id) => (
						<BlockedUserItem key={id}>
							<div>
								<BlockedUserAvatar src='/images/default-profile.png' alt='Blocked user'/>
								<BlockedUserName>{relation.displayName}</BlockedUserName>
							</div>
							<PongButton onClick={e => handleUnblock(e, relation.relationID)}>
								{t('settings.visibility.subSections.blockedUsers.unblockButton')}
							</PongButton>
						</BlockedUserItem>
					))}
				</BlockedUserList>
			) : <p>{t('settings.visibility.subSections.blockedUsers.noResults')}</p>}
		</Form>
	);
};

export default Visibility;
