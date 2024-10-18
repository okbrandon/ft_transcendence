import React, { useEffect, useState } from "react";
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
	const { setUser, loading } = useAuth();
	const { addNotification } = useNotification();
	const [meUser, setMeUser] = useState(null);
	const [purchasedItems, setPurchasedItems] = useState([]);
	const [storeItems, setStoreItems] = useState([]);
	const [selectedSkin, setSelectedSkin] = useState(null);
	const { t } = useTranslation();

	useEffect(() => {
		getUser()
			.then(response => {
				console.log(response);
				setMeUser(response);
				setUser(response);
			})
			.catch(err => {
				addNotification('error', err?.response?.data?.error || 'An error occurred');
			});
	}, [addNotification]);

	useEffect(() => {
		API.get('/users/@me/settings')
			.then(response => {
				setSelectedSkin(response.data.selectedPaddleSkin);
			})
			.catch(err => {
				addNotification('error', err?.response?.data?.error || 'An error occurred');
			})
	}, [addNotification]);

	const handleEquip = itemID => {
		API.patch('/users/@me/settings', { selectedPaddleSkin: itemID })
			.then(() => {
				setSelectedSkin(itemID);
			})
			.catch(() => {
				addNotification('error', `${t('store.equipError')}`);
			})
	};

	useEffect(() => {
		API.get('/store/items')
			.then(response => {
				setStoreItems(response.data);
			})
			.catch(err => {
				addNotification('error', err?.response?.data?.error || 'An error occurred');
			});
	}, [addNotification]);

	useEffect(() => {
		API.get('/users/@me/purchases')
			.then(response => {
				setPurchasedItems(response.data);
			})
			.catch(err => {
				addNotification('error', err?.response?.data?.error || 'An error occurred');
			});
	}, [addNotification]);

	const handlePurchase = item => {
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
	};

	if (loading || !meUser) {
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
				<CoinsDisplay>{t('store.currentBalance', {balance: `${meUser.money}`})}</CoinsDisplay>
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
								onClick={() => handleEquip(item.itemID)}
								disabled={selectedSkin === item.itemID}
							>
								{selectedSkin === item.itemID ? t('store.equippedLabel') : t('store.equipButton')}
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
