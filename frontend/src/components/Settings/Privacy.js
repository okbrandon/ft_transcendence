import React, { useEffect, useState } from "react";
import { Form, SectionHeading, SubSectionHeading } from "./styles/Settings.styled";
import logger from "../../api/logger";
import API from "../../api/api";
import { InfoParagraph } from "./styles/Privacy.styled";
import PongButton from "../../styles/shared/PongButton.styled";

const Privacy = () => {
	const [isHarvesting, setIsHarvesting] = useState(false);
	const [isDataReady, setIsDataReady] = useState(false);

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
			.catch(err => {
				console.log(err.response.data.error);
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
			<SectionHeading>Data Privacy</SectionHeading>
			<SubSectionHeading>Download Data</SubSectionHeading>
			<PongButton
				onClick={handleHarvest}
				$width="100%"
				disabled={!isDataReady}
			>
				{isDataReady ? 'Download' : 'Data not ready'}
			</PongButton>
			<SubSectionHeading>Request Data Export</SubSectionHeading>
			<PongButton
				onClick={handleAskData}
				$width="100%"
				disabled={isHarvesting}
			>
				{isHarvesting ? "Data Harvesting Scheduled" : "Request Data Export"}
			</PongButton>
			{(isHarvesting && !isDataReady) && <InfoParagraph>Come back in a few minutes while we prepare your data...</InfoParagraph>}
		</Form>
	);
};

export default Privacy;
