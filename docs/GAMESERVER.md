# Tournament System

This document explains how the WebSocket server handles tournaments.

## Tournament Creation

1. An admin or authorized user can create a tournament by sending a CREATE_TOURNAMENT event:
   ```json
   {"e": "CREATE_TOURNAMENT", "d": {"name": "Summer Championship", "maxParticipants": 16, "startTime": "2023-07-01T12:00:00Z"}}
   ```

## Tournament Registration

2. Players can register for a tournament by sending a REGISTER_TOURNAMENT event:
   ```json
   {"e": "REGISTER_TOURNAMENT", "d": {"tournamentId": "t123"}}
   ```
   - The server will respond with a REGISTRATION_CONFIRMED event if successful.
   - If the tournament is full, the server will respond with a REGISTRATION_FAILED event.

## Tournament Start

3. When the tournament start time arrives, the server sends a TOURNAMENT_START event to all registered participants:
   ```json
   {"e": "TOURNAMENT_START", "d": {"tournamentId": "t123", "bracket": [...]}}}
   ```
   - The bracket contains information about all matches in the tournament.

## Match Scheduling

4. For each round of the tournament, the server sends MATCH_SCHEDULED events to the participants:
   ```json
   {"e": "MATCH_SCHEDULED", "d": {"matchId": "m456", "opponent": "playerUsername", "startTime": "2023-07-01T13:00:00Z"}}
   ```

## Match Handling

5. Matches within the tournament are handled similarly to regular matches, with the following additions:
   - The MATCH_END event includes tournament-specific information:
     ```json
     {"e": "MATCH_END", "d": {"winner": "user_123", "nextMatchId": "m789"}}
     ```
   - The winner advances to the next match in the bracket.

## Tournament Progress

6. As the tournament progresses, the server sends TOURNAMENT_UPDATE events to all participants:
   ```json
   {"e": "TOURNAMENT_UPDATE", "d": {"tournamentId": "t123", "currentRound": 2, "remainingPlayers": 8}}
   ```

## Tournament Conclusion

7. When the final match ends, the server sends a TOURNAMENT_END event to all participants:
   ```json
   {"e": "TOURNAMENT_END", "d": {"tournamentId": "t123", "winner": "winnerUsername", "finalStandings": [...]}}
   ```

## Handling Disconnections

- If a player disconnects during a tournament match, they forfeit the match.
- If a player fails to join their scheduled match within a set time limit, they forfeit.
- In case of forfeits, the opponent automatically advances to the next round.

This tournament system integrates with the existing match handling system, providing a structured competition format for players.