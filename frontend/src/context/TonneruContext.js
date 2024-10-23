import React, { createContext, useContext, useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import logger from "../api/logger";

const WS_TONNERU_URL = process.env.REACT_APP_ENV === 'production' ? '/ws/tonneru' : 'ws://localhost:8000/ws/tonneru';

export const TonneruContext = createContext({});

const TonneruProvider = ({ children }) => {
    const location = useLocation();
    const socketTonneru = useRef(null);
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
        if (socketTonneru.current && socketTonneru.current.readyState === WebSocket.OPEN) {
            socketTonneru.current.send(JSON.stringify(message));
        } else {
            logger('WebSocket for Tonneru is not open');
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
        socketTonneru.current = new WebSocket(WS_TONNERU_URL);

        socketTonneru.current.onopen = () => {
            logger('WebSocket for Tonneru connection opened');
            setIsConnected(true);
            reconnectAttempts.current = 0;
            identify();
        };

        socketTonneru.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.e === 'HELLO') {
                const heartbeatInterval = data.d.heartbeat_interval;
                setInterval(heartbeat, heartbeatInterval);
            } else {
                setEvents(prevEvents => [...prevEvents, data]);
            }
        };

        socketTonneru.current.onerror = (error) => {
            console.error('WebSocket for Tonneru encountered an error:', error);
            retryConnection();
        };

        socketTonneru.current.onclose = () => {
            logger('WebSocket for Tonneru closed');
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
            if (socketTonneru.current) {
                socketTonneru.current.close();
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
        <TonneruContext.Provider value={{
            isConnected,
            sendMessage,
            events,
            clearEvents,
            registerForTournament,
            addEventListener
        }}>
            {children}
        </TonneruContext.Provider>
    );
};

export const useTonneru = () => useContext(TonneruContext);

export default TonneruProvider;
