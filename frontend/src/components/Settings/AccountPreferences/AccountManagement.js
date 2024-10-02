import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../../api/api';
import {
	AccountManagementButton,
	AccountManagementContainer,
	AccountManagementText,
	ModalOverlay,
	ModalContainer,
	ModalContent,
	ModalButton
} from '../styles/AccountManagement.styled';
import { SubSectionHeading } from '../styles/Settings.styled';
import { useNotification } from '../../../context/NotificationContext';

const AccountManagement = () => {
	const navigate = useNavigate();
	const { addNotification } = useNotification();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleConfirmDelete = () => {
		API.delete('users/@me/profile')
			.then(() => {
				localStorage.removeItem('token');
				localStorage.removeItem('refresh');
				navigate('/signin');
			})
			.catch(err => {
				addNotification('error', `${err?.response?.data?.error || 'An error occurred.'}`);
			});
		setIsModalOpen(false);
	};

	return (
		<>
			<SubSectionHeading>Account Management</SubSectionHeading>
			<AccountManagementContainer>
				<AccountManagementButton type="button" onClick={() => setIsModalOpen(true)}>Delete</AccountManagementButton>
				<AccountManagementText>Delete your account</AccountManagementText>

				{isModalOpen && (
					<ModalOverlay>
						<ModalContainer>
							<ModalContent>
								<p>Are you sure you want to delete your account? This action cannot be undone.</p>
								<div>
									<ModalButton onClick={handleConfirmDelete}>Yes, Delete</ModalButton>
									<ModalButton onClick={() => setIsModalOpen(false)}>Cancel</ModalButton>
								</div>
							</ModalContent>
						</ModalContainer>
					</ModalOverlay>
				)}
			</AccountManagementContainer>
		</>
	);
};

export default AccountManagement;
