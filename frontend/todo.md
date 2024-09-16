# TODO
## today
- Sign up: email verification notification
- Settings: modal that says "saved"
- Settings: Add information directly
- Change colors of logout button
- harvesting:
    - get /users/@me/harvest
    - get /users/@me/exports === 404 ? nothing : button -> get /users/@me/exports
    - scheduled_harvesting === true ? don't show button : show button -> post /users/@me/harvest
    - if both true && 'wait some minutes...'
- 2fa:
    - toggle button
    - turn off -> ask for a code
    - turn on -> api => token -> transform to qrcode
- Settings:
    - Account Preferences:
        - Profile Information:
            - Username
            - DisplayName
            - Verification
        - General Preference:
            - Language
        - Account Management:
            - Close account
    - Sign in & security:
        - Email
        - Password
        - 2FA
    - Visibility:
        - Blocked People
    - Data Privacy:
        - Harvest
- Profile: add block button
- Tell Leader to fix the problem with setting the phone_number back to null
- Ask for the code you receive when setting a number

## Secondary
- 2FA aled
- Popup friends
- Sign up username case
- shop with api aled
- harvest data

## A la fin
- [] fake captcha
