import React, { useState } from 'react';
import Image from 'react-bootstrap/Image';
import UsernameContainer from '../../styles/layouts/UsernameContainer.styled';

const UserProfile = () => {
	const [statusColor, setStatusColor] = useState('green');
	return (
		<>
			<Image src='./anonymous.png' alt='anonymous' roundedCircle style={{'width': '200px', 'marginBottom': '20px'}}/>
			<UsernameContainer>
				<i className="bi bi-circle-fill" style={{ fontSize: '20px', color: statusColor }}></i>
				<h2 style={{fontSize: '2rem'}}>Username</h2>
			</UsernameContainer>
			<p>'custom status'</p>
			<p>Rank: <strong>Dummy</strong></p>
			<p>Last online: <strong>xx/xx/xxxx xx:xx</strong></p>
		</>
	);
};

export default UserProfile;
