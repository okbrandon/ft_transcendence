import React, { useState, useEffect } from "react";
import { ProfileListContainer } from "../../styles/Home/Navigation.styled";
import Image from 'react-bootstrap/Image';

const SearchList = ({ input, results }) => {
	return (
		<ProfileListContainer>
			{/* <p>{results.filter((element) => element.includes(input))}</p> */}
			<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<Image style={{width: '25px', height: '25px'}} src='./images/prune.jpg' alt='profile picture' roundedCircle/>
				<p>{input}</p>
			</div>
		</ProfileListContainer>
	);
};

export default SearchList;
