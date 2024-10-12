import React from "react";
import { DisplaySkinPaddle } from "../styles/content/DisplaySkin.styled";
import { UserInfoItemContainer, UserInfoItemTitle } from "../styles/Profile.styled";
import { useTranslation } from "react-i18next";

const DisplaySkin = ({ currentSkin }) => {
    const { t } = useTranslation();

    return (
        <UserInfoItemContainer>
            <UserInfoItemTitle>{t('profile.skinDisplay.title')}</UserInfoItemTitle>
            <DisplaySkinPaddle $skin={'/images/skins/' + currentSkin}/>
        </UserInfoItemContainer>
    );
};

export default DisplaySkin;
