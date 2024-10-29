import React from "react";
import { SearchListContainer, SearchListItem, SearchListItemImage, SearchListItemText } from "./styles/SearchList.styled";
import { useTranslation } from "react-i18next";

const SearchList = ({ results, activeIndex, handleSelect }) => {
	const { t } = useTranslation();

	return (
		<SearchListContainer>
			{results && results.length ? results.map((profile, index) => (
				<SearchListItem
					key={profile.userID}
					onClick={() => handleSelect(profile.username)}
					className={index === activeIndex ? 'selected' : ''}>
					<SearchListItemImage src={profile.avatarID} alt={`${profile.username}'s avatar`}/>
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
