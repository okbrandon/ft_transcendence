import React, { useState } from 'react';
import styled from 'styled-components';
import magnifier from './img/magnifier.svg';

const SearchFriendsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  position: relative; /* Ensures dropdown is positioned correctly */
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 2px 10px 2px 30px; /* Add padding-left to make space for the icon */
  border: 1px solid #ccc;
  border-radius: 4px;
  background-image: url(${magnifier});
  background-size: 16px;
  background-position: 8px center;
  background-repeat: no-repeat;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%; /* Places the dropdown right below the input */
  left: 0;
  width: 100%;
  max-height: 150px; /* Limits the height of the dropdown */
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  z-index: 1000; /* Ensures it appears above other elements */
`;

const FriendItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  color: black;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

export const SearchFriends = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState(['Alice', 'Bob', 'Brandonation', 'Evanescence', 'Hanministrateur', 'Kianatomy']);

  const filteredFriends = friends.filter(friend => 
    friend.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SearchFriendsContainer>
      <SearchInput
        type="text"
        placeholder="Search for Friends..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* Only show dropdown if there is a search query */}
      {searchQuery && (
        <Dropdown>
          {filteredFriends.map((friend, index) => (
            <FriendItem key={index}>{friend}</FriendItem>
          ))}
        </Dropdown>
      )}
    </SearchFriendsContainer>
  );
};
