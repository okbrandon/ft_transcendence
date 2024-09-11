import React from "react";
import {
	FeatureItem,
	FeaturesSection,
	Line,
	Teaser
} from "./styles/Features.styled";

const Features = () => {
	return (
		<>
			<FeaturesSection>
				<Line/>
				<FeatureItem>
					<i className="bi bi-globe"/>
					<h3>Multiplayer</h3>
				</FeatureItem>
				<FeatureItem>
					<i className="bi bi-trophy-fill"/>
					<h3>Leaderboard</h3>
				</FeatureItem>
				<FeatureItem>
					<i className="bi bi-brush-fill"/>
					<h3>Skins</h3>
				</FeatureItem>
			</FeaturesSection>
			<Teaser>...And Much More!</Teaser>
		</>
	);
};

export default Features;
