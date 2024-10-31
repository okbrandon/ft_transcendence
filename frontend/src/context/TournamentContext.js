import React, { createContext, useContext, useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logger from "../api/logger";

const WS_TOURNAMENT_URL = process.env.REACT_APP_ENV === 'production' ? '/ws/tournaments' : 'ws://localhost:8000/ws/tournaments';

export const TournamentContext = createContext({});

const TournamentProvider = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const socketTournament = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [events, setEvents] = useState([]);
    const eventListeners = useRef({});
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;

    const addEventListener = useCallback((eventType, callback) => {
        if (!eventListeners.current[eventType]) {
            eventListeners.current[eventType] = [];
        }
        eventListeners.current[eventType].push(callback);
        return () => {
            eventListeners.current[eventType] = eventListeners.current[eventType].filter(cb => cb !== callback);
        };
    }, []);

    useEffect(() => {
        const lastEvent = events[events.length - 1];
        if (lastEvent && eventListeners.current[lastEvent.e]) {
            const listeners = eventListeners.current[lastEvent.e];
            if (Array.isArray(listeners)) {
                listeners.forEach(callback => {
                    if (typeof callback === 'function') {
                        callback(lastEvent);
                    } else {
                        console.warn(`Invalid callback for event ${lastEvent.e}:`, callback);
                    }
                });
            } else {
                console.warn(`No valid listeners for event ${lastEvent.e}`);
            }
        }
    }, [events]);

    const sendMessage = (message) => {
        if (socketTournament.current && socketTournament.current.readyState === WebSocket.OPEN) {
            socketTournament.current.send(JSON.stringify(message));
        } else {
            logger('WebSocket for Tournaments is not open');
        }
    };

    const identify = () => {
        sendMessage({
            e: 'IDENTIFY',
            d: { token: localStorage.getItem('token') }
        });
    };

    const heartbeat = () => {
        sendMessage({ e: 'HEARTBEAT' });
    };

    const connectWebSocket = () => {
        socketTournament.current = new WebSocket(WS_TOURNAMENT_URL);

        socketTournament.current.onopen = () => {
            logger('WebSocket for Tournaments connection opened');
            setIsConnected(true);
            reconnectAttempts.current = 0;
            identify();
        };

        socketTournament.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.e === 'HELLO') {
                const heartbeatInterval = data.d.heartbeat_interval;
                setInterval(heartbeat, heartbeatInterval);
            } else if (data.e === 'TOURNAMENT_READY') {
                navigate(`/tournaments/${data.d.tournament.tournamentID}/play`, { state: { tournamentData: data.d } });
            } else {
                setEvents(prevEvents => [...prevEvents, data]);
            }
        };

        socketTournament.current.onerror = (error) => {
            console.error('WebSocket for Tournaments encountered an error:', error);
            retryConnection();
        };

        socketTournament.current.onclose = () => {
            logger('WebSocket for Tournaments closed');
            setIsConnected(false);
            retryConnection();
        };
    };

    const retryConnection = () => {
        if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current += 1;
            logger(`Attempting to reconnect... (Attempt ${reconnectAttempts.current})`);
            setTimeout(connectWebSocket, 5000 * reconnectAttempts.current);
        } else {
            logger('Max reconnection attempts reached.');
        }
    };

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (socketTournament.current) {
                socketTournament.current.close();
            }
        };
    }, []);

    const registerForTournament = (tournamentID) => {
        sendMessage({
            e: 'REGISTER_TOURNAMENT',
            d: { tournamentID }
        });
    };

    const clearEvents = () => {
        setEvents([]);
    };

    return (
        <TournamentContext.Provider value={{
            isConnected,
            sendMessage,
            events,
            clearEvents,
            registerForTournament,
            addEventListener
        }}>
            {children}
        </TournamentContext.Provider>
    );
};

export const useTournament = () => useContext(TournamentContext);

export default TournamentProvider;