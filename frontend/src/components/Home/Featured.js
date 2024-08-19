import React from "react";
import { FeaturedContainer } from "../../styles/Home/Featured.styled";
import Carousel from "react-bootstrap/Carousel";

const Featured = () => {
	return (
		<FeaturedContainer>
			<h1>Featured</h1>
			<Carousel>
				<Carousel.Item>
					<Carousel.Caption>
						<h2>Real-Time Multiplayer</h2>
						<p>Challenge your friends to a real-time Pong match and see who comes out on the top!</p>
					</Carousel.Caption>
				</Carousel.Item>
				<Carousel.Item>
					<Carousel.Caption>
						<h2>Leaderboard</h2>
						<p>Compete with other players and climb your way to the top of the leaderboard!</p>
					</Carousel.Caption>
				</Carousel.Item>
				<Carousel.Item>
					<Carousel.Caption>
						<h2>Store</h2>
						<p>Customize your Pong paddle and ball with the latest skins and effects!</p>
					</Carousel.Caption>
				</Carousel.Item>
				<Carousel.Item>
					<Carousel.Caption>
						<h2>Custom Tournaments</h2>
						<p>Create and join custom tournaments to compete with friends and other players for exciting prizes!</p>
					</Carousel.Caption>
				</Carousel.Item>
			</Carousel>
		</FeaturedContainer>
	);
};

export default Featured;
