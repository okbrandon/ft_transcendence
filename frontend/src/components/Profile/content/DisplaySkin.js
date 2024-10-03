import React from "react";
import { DisplaySkinContainer, DisplaySkinPaddle } from "../styles/content/DisplaySkin.styled";
import { CardTitle } from "../styles/Profile.styled";
import { useTranslation } from "react-i18next";

const DisplaySkin = ({ profileUser }) => {
    const { t } = useTranslation();

    return (
        <DisplaySkinContainer>
            <CardTitle>{t('profile.skinDisplay.title')}</CardTitle>
            <DisplaySkinPaddle $skin={'/images/skins/galaxy.jpeg'}/>
        </DisplaySkinContainer>
    );
};

export default DisplaySkin;
