import React from "react";
import {
	FeatureItem,
	FeaturesSection,
	Line,
	Teaser
} from "./styles/Features.styled";
import { useTranslation } from "react-i18next";

const Features = () => {
	const { t } = useTranslation();

	return (
		<>
			<FeaturesSection>
				<Line/>
				<FeatureItem>
					<i className="bi bi-globe"/>
					<h3>{t('home.features.first')}</h3>
				</FeatureItem>
				<FeatureItem>
					<i className="bi bi-trophy-fill"/>
					<h3>{t('home.features.second')}</h3>
				</FeatureItem>
				<FeatureItem>
					<i className="bi bi-brush-fill"/>
					<h3>{t('home.features.third')}</h3>
				</FeatureItem>
			</FeaturesSection>
			<Teaser>{t('home.features.teaser')}</Teaser>
		</>
	);
};

export default Features;
