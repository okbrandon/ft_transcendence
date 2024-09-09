import React from "react";
import {
	CardsContainer,
	Cards,
	ContributorsContainer,
	Card,
	Title,
	SubTitle
} from "./styles/Contributors.styled";

const contributors =[
	{
		name: "Brandon",
		role: "Backend",
		image: "https://avatars.githubusercontent.com/u/103316367?v=4",
		github: "https://github.com/okbrandon"
	},
	{
		name: "Kian",
		role: "Frontend",
		image: "https://avatars.githubusercontent.com/u/124782521?v=4",
		github: "https://github.com/Kariyu42"
	},
	{
		name: "Evan",
		role: "Backend",
		image: "https://avatars.githubusercontent.com/u/56516450?v=4",
		github: "https://github.com/evnsh"
	},
	{
		name: "Hanmin",
		role: "Frontend",
		image: "https://avatars.githubusercontent.com/u/96551547?v=4",
		github: "https://github.com/hanmpark"
	}
];

const Contributors = () => {
	return (
		<ContributorsContainer>
			<Title>TEAM</Title>
			<SubTitle>Meet the team behind the project</SubTitle>
			<CardsContainer>
				<Cards>
					{contributors.map((contributor, index) => (
						<Card
							key={index}
							onClick={() => window.open(contributor.github, "_blank")}
						>
							<img src={contributor.image} alt={`Contributor ${contributor.name}'s avatar`}/>
							<h3>{contributor.name}</h3>
							<p>{contributor.role}</p>
						</Card>
					))}
				</Cards>
			</CardsContainer>
		</ContributorsContainer>
	);
};

export default Contributors;
