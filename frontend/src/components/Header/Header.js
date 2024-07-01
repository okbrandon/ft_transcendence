import React from 'react'; // import the React library
import './Header.css'; // import the css file

const Header = () => {
	return (
		<header className='header'>
			<nav className='navbar'>
				<ul className='nav-list'>
					<li className='nav-item-left'><a href='#home'>PONG.</a></li>
					<li className='nav-item-right'>
						<span className='btn-login'>
							<a href='#login'></a>
						</span>
					</li>
				</ul>
			</nav>
		</header>
	);
}

export default Header; // means this file can be imported in other files
