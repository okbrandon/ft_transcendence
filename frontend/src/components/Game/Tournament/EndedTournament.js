import React, { useState, useEffect } from 'react';
import {
	BackgroundTournamentContainer,
	BottomContainer,
	EndTournamentContainer,
	NavButtons,
	ParticipantsDetails,
	TournamentHeadDetails,
	TournamentNavigation,
	TournamentTitle
} from '../styles/Tournament/EndedTournament.styled';
import PositionPage from './EndedTournamentPages/PositionPage';
import TournamentOverview from './EndedTournamentPages/TournamentOverview';

// data template
const tournamentData = {
	winner: {
        userID: "user_X",
        username: "caca",
        displayName: null,
        lang: "EN",
        avatarID: null
    },
    matches: [
        {
            matchID: "match_X",
            playerA: {
                id: "user_X",
                platform: "web"
            },
            playerB: {
                id: "user_Y",
                platform: "web"
            },
            scores: {
                "user_X": 8,
                "user_Y": 10
            },
            winnerID: "user_Y",
            startedAt: "2016-06-01T00:00:00Z",
            finishedAt: "2016-06-01T00:00:00Z",
            flags: 2
        },
        {
            matchID: "match_Y",
            playerA: {
                id: "user_Y",
                platform: "web"
            },
            playerB: {
                id: "user_Z",
                platform: "web"
            },
            scores: {
                "user_Y": 8,
                "user_Z": 10
            },
            winnerID: "user_Z",
            startedAt: "2016-06-01T00:00:00Z",
            finishedAt: "2016-06-01T00:00:00Z",
            flags: 2
        }
    ]
};

const EndedTournament = () => {
	const [selected, setSelected] = useState("Position");

	const handleSelection = (selection) => {
		setSelected(selection);
	}

	return (
		<EndTournamentContainer>
			<div>Tournament's Result</div>
			<TournamentHeadDetails>
				<TournamentTitle>Dark Zone Championship</TournamentTitle>
				<ParticipantsDetails>Number of Participants: 9/10</ParticipantsDetails>
			</TournamentHeadDetails>

			<TournamentNavigation>
				<BackgroundTournamentContainer>
					<NavButtons $isActive={selected === 'Position'} onClick={() => handleSelection('Position')}>Position</NavButtons>
					<NavButtons $isActive={selected === 'Overview'} onClick={() => handleSelection('Overview')}>Overview</NavButtons>
				</BackgroundTournamentContainer>
			</TournamentNavigation>

			<BottomContainer>
				{selected === "Position" && <PositionPage tournamentData={tournamentData}/>}
				{selected === "Overview" && <TournamentOverview tournamentData={tournamentData}/>}
			</BottomContainer>

		</EndTournamentContainer>
	);
};

export default EndedTournament;
