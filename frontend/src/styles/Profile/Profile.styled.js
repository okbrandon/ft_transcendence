import styled from "styled-components";

export const ProfileContainer = styled.div`
	position: relative;
	width: 100%;
	background: #0c0b1b;
	height: 1500px;
`;

export const ProfileBanner = styled.div`
	width: 100%;
	height: 250px;
	--s: 200px;
	--c1: #000;
	--c2: #0c0b1b;

	--_g: var(--c2) 4% 14%, var(--c1) 14% 24%, var(--c2) 22% 34%,
		var(--c1) 34% 44%, var(--c2) 44% 56%, var(--c1) 56% 66%, var(--c2) 66% 76%,
		var(--c1) 76% 86%, var(--c2) 86% 96%;
	background: radial-gradient(
			100% 100% at 100% 0,
			var(--c1) 4%,
			var(--_g),
			#0008 96%,
			#0000
		),
		radial-gradient(
			100% 100% at 0 100%,
			#0000,
			#0008 4%,
			var(--_g),
			var(--c1) 96%
		)
		var(--c1);
	background-size: var(--s) var(--s);
`;

export const ProfileContentContainer = styled.div`
	position: relative;
	width: 100%;
`;
