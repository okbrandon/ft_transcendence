import React from "react";
import { ErrorMessage, SettingsForm, SettingsItem } from "../styles/Settings.styled";

const ConfirmPassword = ({ confirmPassword, handleChange, error }) => {
    return (
        <SettingsItem $width="350px">
            <SettingsForm.Group className="mb-3">
                <h3>Confirm Password</h3>
                <SettingsForm.Label htmlFor="confirmPassword"><i className="bi bi-lock-fill"/></SettingsForm.Label>
                <SettingsForm.Control
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    type="password"
                    placeholder="Confirm password"
                    style={{borderColor: error ? 'red' : 'inherit'}}
                />
            </SettingsForm.Group>
            {error && <ErrorMessage>Passwords do not match</ErrorMessage>}
        </SettingsItem>
    );
};

export default ConfirmPassword;
