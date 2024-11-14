import React, { useEffect, useState } from "react";
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
	const [loading, setLoading] = useState(false);
	const { t } = useTranslation();

	useEffect(() => {
		if (!loading) return;
		const timeout = setTimeout(() => {
			setLoading(false);
		}, 1000);
		return () => clearTimeout(timeout);
	}, [loading]);

	if (!blockedUsers) return <Loader/>;

	const handleUnblock = (e, relationshipID) => {
		e.preventDefault();
		if (loading) return;
		setLoading(true);
		API.delete(`users/@me/relationships/${relationshipID}`)
			.then(() => {
				addNotification('success', t('settings.visibility.successMessage'));
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
								<BlockedUserAvatar src='/images/default-profile.webp' alt='Blocked user'/>
								<BlockedUserName>{relation.displayName}</BlockedUserName>
							</div>
							<PongButton onClick={e => handleUnblock(e, relation.relationshipID)}>
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
