import React from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';

const FriendsList = ({ showFriends, handleFriends }) => {
	return (
		<Offcanvas show={showFriends} onHide={handleFriends}>
			<Offcanvas.Header closeButton>
				<Offcanvas.Title>Friends</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body>
				NO FRIENDS
			</Offcanvas.Body>
		</Offcanvas>
	);
};

export default FriendsList;