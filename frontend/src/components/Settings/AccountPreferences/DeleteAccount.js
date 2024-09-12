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

const DeleteAccount = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleConfirmDelete = () => {
		// Logic to handle account deletion
		console.log('Account Deleted');
		// Close the modal after confirming
		setIsModalOpen(false);
	};
	return (
		<DeleteAccountContainer>
			<DeleteAccountButton onClick={() => setIsModalOpen(true)}>Delete</DeleteAccountButton>
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
