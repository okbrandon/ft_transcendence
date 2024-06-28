import React from 'react'; // import the React library
import './Header.css'; // import the css file

const Header = () => {
	return (
		<header className='header'>
			<nav className='navbar'>
				<ul className='nav-list'>
					<li className='nav-item-left'><a href='#home'>PONG.</a></li>
					<li className='nav-item-right'><a className='btn-login' href='#login'>Connect</a></li>
				</ul>
			</nav>
		</header>
	);
}

export default Header; // means this file can be imported in other files
