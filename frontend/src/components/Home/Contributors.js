import React from "react";
import {
	CardsContainer,
	Cards,
	ContributorsContainer,
	Card,
	Title,
	SubTitle
} from "./styles/Contributors.styled";
import { useTranslation } from "react-i18next";

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
	const { t } = useTranslation();

	return (
		<ContributorsContainer>
			<Title>{t('home.contributors.title')}</Title>
			<SubTitle>{t('home.contributors.subTitle')}</SubTitle>
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
