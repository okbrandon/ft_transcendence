# TODO
## today
- Sign up: email verification notification
- 2FA
- Friends: add popup
- Profile: block button API
- harvesting:
    - get /users/@me/harvest
    - get /users/@me/exports === 404 ? nothing : button -> get /users/@me/exports
    - scheduled_harvesting === true ? don't show button : show button -> post /users/@me/harvest
    - if both true && 'wait some minutes...'

## Waiting leader
- Tell Leader to fix the problem with setting the phone_number back to null
- Ask for the code you receive when setting a number

## Secondary
- Change colors of logout button
- shop with api aled

## A la fin
- fake captcha


## Settings layout
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
