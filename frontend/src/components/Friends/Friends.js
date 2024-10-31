import React, { useEffect, useState } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import RequestsList from "./RequestsList";
import FriendsList from "./FriendsList";
import {
	Header,
	PageContainer,
	SearchInput,
} from "./styles/Friends.styled";
import Loader from "../../styles/shared/Loader.styled";
import { useRelation } from "../../context/RelationContext";
import { useTranslation } from "react-i18next";

const Friends = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const { friends, requests, setIsRefetch } = useRelation();
	const { t } = useTranslation();

	useEffect(() => {
		setIsRefetch(true);
	}, [setIsRefetch]);

	if (!friends || !requests) {
		return (
			<PageContainer>
				<Loader/>
			</PageContainer>
		);
	}

	const filteredFriends = friends.filter(friend => {
		return friend.displayName.toLowerCase().includes(searchTerm.toLowerCase());
	});

	return (
		<PageContainer>
			<Header>
				<h1>{t('friends.title')}</h1>
				<SearchInput
					id="friends-search"
					type="text"
					placeholder={t('friends.placeholder')}
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
				/>
			</Header>
			<Tabs
				defaultActiveKey="friends"
				className="mb-3"
			>
				<Tab eventKey="friends" title="Friends">
					<FriendsList friends={filteredFriends} />
				</Tab>
				<Tab eventKey="requests" title="Requests">
					<RequestsList requests={requests} />
				</Tab>
			</Tabs>
		</PageContainer>
	);
};

export default Friends;
