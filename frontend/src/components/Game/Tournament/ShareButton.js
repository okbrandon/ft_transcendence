import React, { useState } from 'react';
import { useNotification } from '../../../context/NotificationContext';
import { Button } from '../styles/Tournament/ShareButton.styled';

const ShareButton = () => {
	const [buttonText, setButtonText] = useState('Share');
	const [copied, setCopied] = useState(false);
	const { addNotification } = useNotification();

	const handleClick = () => {
		navigator.clipboard.writeText(window.location.href);
		setButtonText('Copied');
		setCopied(true);
		addNotification('success', 'Link copied to clipboard!');

		setTimeout(() => {
			setButtonText('Share');
			setCopied(false);
		}, 3000);
	};

	return (
		<Button onClick={handleClick} copied={copied}>
			{copied ? (
				<i className="bi bi-check-lg" style={{ marginRight: '8px' }}></i>
			) : (
				<i className="bi bi-share" style={{ marginRight: '8px' }}></i>
			)}
			{buttonText}
		</Button>
	);
};

export default ShareButton;
