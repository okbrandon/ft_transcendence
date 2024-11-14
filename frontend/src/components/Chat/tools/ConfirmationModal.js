import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const ModalOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	backdrop-filter: blur(5px);
	z-index: 1000;
`;

const ModalContent = styled.div`
	background-color: white;
	padding: 20px;
	border-radius: 8px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	max-width: 400px;
	width: 100%;
`;

const ModalTitle = styled.h2`
	margin-top: 0;
	color: #333;
`;

const ModalButtons = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-top: 20px;
`;

const Button = styled.button`
	padding: 10px 20px;
	margin-left: 10px;
	border: none;
	border-radius: 4px;
	cursor: pointer;
`;

const ConfirmButton = styled(Button)`
	background-color: #d9534f;
	color: white;
`;

const CancelButton = styled(Button)`
	background-color: #f0f0f0;
`;

const MessageContent = styled.p`
	margin-top: 0;
	color: #333;
`;

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
	const { t } = useTranslation();

	if (!isOpen) return null;

	return (
		<ModalOverlay>
			<ModalContent>
				<ModalTitle>{title}</ModalTitle>
				<MessageContent>{message}</MessageContent>
				<ModalButtons>
					<CancelButton onClick={onClose}>{t('chat.confirmModal.cancelButton')}</CancelButton>
					<ConfirmButton onClick={onConfirm}>{t('chat.confirmModal.confirmButton')}</ConfirmButton>
				</ModalButtons>
			</ModalContent>
		</ModalOverlay>
	);
};

export default ConfirmationModal;
