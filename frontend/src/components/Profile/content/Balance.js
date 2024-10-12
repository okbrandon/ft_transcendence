import React from "react";
import { BalanceContainer, UserInfoItemContainer, UserInfoItemTitle } from "../styles/Profile.styled";
import { useTranslation } from "react-i18next";

const Balance = ({ profileUser }) => {
	const { t } = useTranslation();

	return (
		<UserInfoItemContainer>
			<UserInfoItemTitle>Balance</UserInfoItemTitle>
				<BalanceContainer>
					<p>{t('store.currency.icon')} {profileUser.money}</p>
				</BalanceContainer>
		</UserInfoItemContainer>
	);
};

export default Balance;
