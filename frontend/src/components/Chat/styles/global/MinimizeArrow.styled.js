import styled from 'styled-components';

const MinimizeArrow = styled.div`
	width: 1.25rem;
	height: 1.25rem;
	display: inline-block;
	position: relative;
	margin: 0 1rem;
	cursor: pointer;

	span {
		top: 0.5rem;
		position: absolute;
		width: 0.75rem;
		height: 0.1rem;
		background-color: #efefef;
		display: inline-block;
		transition: all 0.2s ease;

		&:first-of-type {
			left: 0;
			transform: rotate(45deg);
		}

		&:last-of-type {
			right: 0;
			transform: rotate(-45deg);
		}
	}

	&.active span {
		&:first-of-type {
			transform: rotate(-45deg);
		}

		&:last-of-type {
			transform: rotate(45deg);
		}
	}
`;

export const MinimizeArrowContainer = styled.div`
	display: flex;
	align-self: center;
	justify-content: center;
`;

export default MinimizeArrow;
