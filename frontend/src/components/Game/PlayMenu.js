import React from "react";
import { useNavigate } from "react-router-dom";
import { ModeCard, ModesContainer, PlayMenuContainer, Title } from "./styles/PlayMenu.styled";
import { useTranslation } from "react-i18next";

const PlayMenu = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	return (
		<PlayMenuContainer>
			<Title>{t('playMenu.title')}</Title>
			<ModesContainer>
				<ModeCard onClick={() => navigate('/game-ai')}>
					<h1>{t('playMenu.ai.title')}</h1>
				</ModeCard>
				<ModeCard onClick={() => navigate('/tournaments')}>
					<h1>{t('playMenu.tournament.title')}</h1>
				</ModeCard>
				<ModeCard onClick={() => navigate('/game-classic')}>
					<h1>{t('playMenu.1v1.title')}</h1>
				</ModeCard>
				<ModeCard onClick={() => navigate('/game-local')}>
					<h1>{t('playMenu.local.title')}</h1>
				</ModeCard>
			</ModesContainer>
		</PlayMenuContainer>
	);
};

export default PlayMenu;
