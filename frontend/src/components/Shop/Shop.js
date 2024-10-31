import React, { useCallback, useEffect, useState } from "react";
import {
	ShopContainer,
	CoinsDisplay,
	SkinsGrid,
	SkinCard,
	SkinImage,
	SkinPrice,
	BuyButton,
	SkinName,
    Header,
	SubtitleSection,
} from "./styles/Shop.styled";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/api";
import { getUser } from "../../api/user";
import Loader from "../../styles/shared/Loader.styled";
import { useNotification } from "../../context/NotificationContext";
import { useTranslation } from "react-i18next";

const Shop = () => {
	const { loading } = useAuth();
	const { addNotification } = useNotification();
	const [user, setUser] = useState(null);
	const [purchasedItems, setPurchasedItems] = useState([]);
	const [storeItems, setStoreItems] = useState([]);
	const [selectedSkin, setSelectedSkin] = useState(null);
	const { t } = useTranslation();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [meUser, storeItems, purchasedItems, selectedSkin] = await Promise.all([
					getUser(),
					API.get('/store/items'),
					API.get('/users/@me/purchases'),
					API.get('/users/@me/settings'),
				]);

				setUser(meUser);
				setStoreItems(storeItems.data);
				setPurchasedItems(purchasedItems.data);
				setSelectedSkin(selectedSkin.data.selectedPaddleSkin);
			} catch (err) {
				addNotification('error', err?.response?.data?.error || 'An error occurred');
			}
		}

		fetchData();
	}, [addNotification]);

	const handlePurchase = useCallback(item => {
		API.post(`/store/${item.itemID}/purchase`)
			.then(response => {
				setPurchasedItems(prev => [...prev, response.data]);
				setUser(prev => ({
					...prev,
					money: prev.money - item.price,
				}));
			})
			.catch(err => {
				if (err.response && err.response.status === 400) {
					addNotification('error', t('store.insufficientFunds'));
				} else {
					addNotification('error', t('store.purchaseError'));
				}
			});
	}, [addNotification, t]);

	const handleEquip = useCallback(itemID => {
		API.patch('/users/@me/settings', { selectedPaddleSkin: itemID })
			.then(() => setSelectedSkin(itemID))
			.catch(() => addNotification('error', `${t('store.equipError')}`));
	}, [addNotification, t]);

	if (loading || !user || !storeItems.length) {
		return (
			<ShopContainer>
				<Loader/>
			</ShopContainer>
		);
	}

	return (
		<ShopContainer>
			<Header>
				<h1>{t('store.title')}</h1>
				<CoinsDisplay>{t('store.currentBalance', {balance: `${user.money}`})}</CoinsDisplay>
			</Header>
			<SubtitleSection>
				<p>{t('store.subTitle')}</p>
			</SubtitleSection>
			<SkinsGrid>
				{storeItems.map((item) => (
					<SkinCard key={item.itemID}>
						<SkinImage src={'/images/skins/' + item.assetID} alt={item.name} />
						<SkinName>{item.name}</SkinName>
						<SkinPrice>{item.price} {t('store.currency.icon')}</SkinPrice>
						{purchasedItems.some(purchase => purchase.itemID === item.itemID) ? (
							<BuyButton
								onClick={() => selectedSkin === item.itemID ? handleEquip(null) : handleEquip(item.itemID)}
								className={selectedSkin === item.itemID ? 'unequip' : ''}
							>
								{selectedSkin === item.itemID ? 'unequip' : t('store.equipButton')}
							</BuyButton>
						) : (
							<BuyButton onClick={() => handlePurchase(item)}>
								{t('store.buyButton')}
							</BuyButton>
						)}
					</SkinCard>
				))}
			</SkinsGrid>
		</ShopContainer>
	);
}

export default Shop;
