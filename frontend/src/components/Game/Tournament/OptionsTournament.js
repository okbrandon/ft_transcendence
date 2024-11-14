import React from "react";
import { useNavigate } from "react-router-dom";
import {
	OptionButton,
	TournamentOptionsContainer
} from "../styles/Tournament/Tournament.styled";
import { useTranslation } from "react-i18next";

const OptionsTournament = ({ setOptions }) => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	return (
		<TournamentOptionsContainer>
			<h1>{t('playMenu.tournament.options.title')}</h1>
			<OptionButton onClick={() => setOptions('create')}>
				{t('playMenu.tournament.options.createButton.title')}
				<p>{t('playMenu.tournament.options.createButton.subTitle')}</p>
			</OptionButton>
			<OptionButton onClick={() => setOptions('join')}>
				{t('playMenu.tournament.options.joinButton.title')}
				<p>{t('playMenu.tournament.options.joinButton.subTitle')}</p>
			</OptionButton>
			<OptionButton onClick={() => navigate('/playmenu')}>
				<i className="bi bi-arrow-left"/> {t('playMenu.tournament.options.backButton')}
			</OptionButton>
		</TournamentOptionsContainer>
	);
};

export default OptionsTournament;
