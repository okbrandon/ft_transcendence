import React, { useCallback, useState } from 'react';
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
import { useTranslation } from 'react-i18next';

const AccountManagement = () => {
	const navigate = useNavigate();
	const { addNotification } = useNotification();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { t } = useTranslation();

	const handleConfirmDelete = useCallback(() => {
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
	}, [addNotification, navigate]);

	return (
		<>
			<SubSectionHeading>{t('settings.accountPreferences.subSections.accountManagement.title')}</SubSectionHeading>
			<AccountManagementContainer>
				<AccountManagementButton type="button" onClick={() => setIsModalOpen(true)}>{t('settings.accountPreferences.subSections.accountManagement.deleteButton')}</AccountManagementButton>
				<AccountManagementText>{t('settings.accountPreferences.subSections.accountManagement.deleteConfirmation.title')}</AccountManagementText>

				{isModalOpen && (
					<ModalOverlay>
						<ModalContainer>
							<ModalContent>
								<p>{t('settings.accountPreferences.subSections.accountManagement.deleteConfirmation.subTitle')}</p>
								<div>
									<ModalButton onClick={handleConfirmDelete}>{t('settings.accountPreferences.subSections.accountManagement.deleteConfirmation.deleteButton')}</ModalButton>
									<ModalButton onClick={() => setIsModalOpen(false)}>{t('settings.accountPreferences.subSections.accountManagement.deleteConfirmation.cancelButton')}</ModalButton>
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
