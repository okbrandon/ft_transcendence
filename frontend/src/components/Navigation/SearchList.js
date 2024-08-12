import React, { useState, useEffect } from "react";
import { ProfileListContainer } from "../../styles/Navigation.styled";

const SearchList = ({ input }) => {
	return (
		<ProfileListContainer>
			<p>{input}</p>
		</ProfileListContainer>
	);
};

export default SearchList;
