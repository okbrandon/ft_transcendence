import styled from 'styled-components';

const NavContainer = styled.nav`
	display: flex;
	background-repeat: no-repeat;
	background: linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 100%);
	justify-content: space-between;
	align-items: center;
	position: fixed;
	padding-left: 6rem;
	padding-right: 6rem;
	top: 0;
	left: 0;
	width: 100vw;
	height: 150px;
	z-index: 10000;
`;

export default NavContainer;
