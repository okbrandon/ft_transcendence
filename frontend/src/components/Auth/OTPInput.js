import React, { useState, useRef } from 'react';
import { Hyphen, OTPContainer, OTPInput } from './styles/OTPInput.styled';

const OTPInputComponent = ({ handleOTPComplete }) => {
	const [otp, setOtp] = useState(['', '', '', '', '', '']);
	const inputRefs = useRef([]);

	const handleChange = (value, index) => {
		if (!isNaN(value)) {
			const newOtp = [...otp];
			newOtp[index] = value;
			setOtp(newOtp);

			if (value !== '' && index < 5) {
				inputRefs.current[index + 1].focus();
			}

			if (newOtp.join('').length === 6) {
				handleOTPComplete(newOtp.join(''));
			}
		}
	};

	const handlePaste = (e) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData('text').replace(/\s/g, '');

		if (pastedData.length === 6 && /^\d+$/.test(pastedData)) {
			const newOtp = pastedData.split('');
			setOtp(newOtp);

			newOtp.forEach((digit, index) => {
				inputRefs.current[index].value = digit;
			});

			handleOTPComplete(newOtp.join(''));
		}
	};

	return (
		<OTPContainer>
			{otp.map((digit, index) => (
				<React.Fragment key={index}>
					<OTPInput
						id={`digit-${index}`}
						type="text"
						maxLength="1"
						value={digit}
						onChange={(e) => handleChange(e.target.value, index)}
						onPaste={handlePaste}
						ref={(el) => (inputRefs.current[index] = el)}
					/>
					{index === 2 && <Hyphen>-</Hyphen>}
				</React.Fragment>
			))}
		</OTPContainer>
	);
};

export default OTPInputComponent;
