import React from "react";
import { SearchListContainer, SearchListItem, SearchListItemImage, SearchListItemText } from "./styles/SearchList.styled";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SearchList = ({ results, setInput, setResults }) => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const handleSelect = (username) => {
		setInput('');
		setResults(null);
		navigate(`/profile/${username}`);
	};

	return (
		<SearchListContainer>
			{results && results.length ? results.map((profile) => (
				<SearchListItem key={profile.userID} onClick={() => handleSelect(profile.username)}>
					<SearchListItemImage src={profile.avatarID} alt='profile picture'/>
					<SearchListItemText>{profile.displayName}</SearchListItemText>
				</SearchListItem>
			)) : (
				<SearchListItem>
					<SearchListItemText>{t('header.searchBar.noResults')}</SearchListItemText>
				</SearchListItem>
			)}
		</SearchListContainer>
	);
};

export default SearchList;
