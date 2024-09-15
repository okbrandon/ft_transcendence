import React, { useState } from 'react';
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

const DeleteAccount = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleConfirmDelete = () => {
		API.delete('/users/@me/profile')
			.then(() => {
				localStorage.removeItem('token');
				localStorage.removeItem('refresh');
				console.log('Account Deleted');
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
