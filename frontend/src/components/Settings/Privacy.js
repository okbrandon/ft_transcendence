import React, { useEffect, useState } from "react";
import { Form, SectionHeading, SubSectionHeading } from "./styles/Settings.styled";
import logger from "../../api/logger";
import API from "../../api/api";
import { InfoParagraph } from "./styles/Privacy.styled";
import PongButton from "../../styles/shared/PongButton.styled";
import { useTranslation } from "react-i18next";

const Privacy = () => {
	const [isHarvesting, setIsHarvesting] = useState(false);
	const [isDataReady, setIsDataReady] = useState(false);
	const { t } = useTranslation();

	useEffect(() => {
		API.get('/users/@me/harvest')
			.then(res => {
				setIsHarvesting(res.data.scheduled_harvesting);
			})
			.catch(err => {
				console.error('Failed to harvest data:', err);
			});

		API.get('/users/@me/exports')
			.then(() => {
				setIsDataReady(true);
			})
			.catch(() => {
				setIsDataReady(false);
			});
	}, []);

	const handleHarvest = (e) => {
		e.preventDefault();
		API.get('/users/@me/exports', { responseType: 'blob' })
			.then(res => {
				const blobUrl = window.URL.createObjectURL(res.data);
				const link = document.createElement('a');
				link.href = blobUrl;
				link.setAttribute('download', 'user_data.zip');
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				window.URL.revokeObjectURL(blobUrl);
				console.log('Data harvested');
				setIsHarvesting(true);
			})
			.catch(err => {
				console.error(err);
			});
	};

	const handleAskData = (e) => {
		e.preventDefault();
		API.post('/users/@me/harvest')
			.then(() => {
				logger('Data harvesting requested');
			})
			.catch(err => {
				console.error(err.response.data.error);
			});
	};

	return (
		<Form>
			<SectionHeading>{t('settings.privacy.title')}</SectionHeading>
			<SubSectionHeading>{t('settings.privacy.subSections.downloadData.title')}</SubSectionHeading>
			<PongButton
				onClick={handleHarvest}
				$width="100%"
				disabled={!isDataReady}
			>
				{isDataReady ? t('settings.privacy.subSections.downloadData.readyButton') : t('settings.privacy.subSections.downloadData.loadingButton')}
			</PongButton>
			<SubSectionHeading>{t('settings.privacy.subSections.requestData.title')}</SubSectionHeading>
			<PongButton
				onClick={handleAskData}
				$width="100%"
				disabled={isHarvesting}
			>
				{isHarvesting ? t('settings.privacy.subSections.requestData.loadingButton') : t('settings.privacy.subSections.requestData.requestButton')}
			</PongButton>
			{(isHarvesting && !isDataReady) && <InfoParagraph>{t('settings.privacy.subTitle')}</InfoParagraph>}
		</Form>
	);
};

export default Privacy;
