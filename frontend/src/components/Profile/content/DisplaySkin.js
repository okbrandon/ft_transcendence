import React from "react";
import { DisplaySkinContainer, DisplaySkinPaddle } from "../styles/content/DisplaySkin.styled";
import { CardTitle } from "../styles/Profile.styled";

const DisplaySkin = ({ profileUser }) => {
    return (
        <DisplaySkinContainer>
            <CardTitle>SKIN DISPLAY</CardTitle>
            <DisplaySkinPaddle $skin={'/images/skins/galaxy.jpeg'}/>
        </DisplaySkinContainer>
    );
};

export default DisplaySkin;
