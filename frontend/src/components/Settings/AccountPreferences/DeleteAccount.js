import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	DeleteAccountButton,
	DeleteAccountContainer,
	DeleteAccountText,
	ModalOverlay,
	ModalContainer,
	ModalContent,
	ModalButton
} from '../styles/DeleteAccount.styled';
import API from '../../../api/api';
import logger from '../../../api/logger'

const DeleteAccount = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const navigate = useNavigate();

	const handleConfirmDelete = () => {
		API.delete('/users/@me/profile')
			.then(() => {
				localStorage.removeItem('token');
				localStorage.removeItem('refresh');
				logger('Account Deleted');
				navigate('/login');
			})
			.catch((err) => {
				console.error(err);
			});
		setIsModalOpen(false);
	};
	return (
		<DeleteAccountContainer>
			<DeleteAccountButton type="button" onClick={() => setIsModalOpen(true)}>Delete</DeleteAccountButton>
			<DeleteAccountText>Delete your account</DeleteAccountText>

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
		</DeleteAccountContainer>
	);
};

export default DeleteAccount;
