import React, { useContext, useState, useEffect } from "react";
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
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/api";
import Loader from "../../styles/shared/Loader.styled";
import { useTranslation } from "react-i18next";

const Shop = () => {
    const [purchasedItems, setPurchasedItems] = useState([]);
	const [storeItems, setStoreItems] = useState([]);
	const { user, loading } = useContext(AuthContext);
	const { t } = useTranslation();
	const [selectedSkin, setSelectedSkin] = useState(null);

    useEffect(() => {
        API.get('/users/@me/settings')
            .then(response => {
                setSelectedSkin(response.data.selectedPaddleSkin);
            })
            .catch(error => {
                console.error('Error fetching user settings:', error);
            });
    }, []);

	const handleEquip = (itemID) => {
        API.patch('/users/@me/settings', { selectedPaddleSkin: itemID })
            .then((response) => {
                setSelectedSkin(itemID);
            })
            .catch((error) => {
                console.error('Error equipping skin:', error);
                alert(t('store.equipError'));
            });
    };
	
	useEffect(() => {
		API.get('/store/items')
			.then(response => {
				setStoreItems(response.data);
			})
			.catch(error => {
				console.error('Error fetching store items:', error);
			});
	}, []);

	useEffect(() => {
		API.get('/users/@me/purchases')
			.then(response => {
				setPurchasedItems(response.data);
			})
			.catch(error => {
				console.error('Error fetching store items:', error);
			});
	}, []);

    const handlePurchase = (item) => {
        API.post(`/store/${item.itemID}/purchase`)
            .then((response) => {
                setPurchasedItems([...purchasedItems, response.data]);
				user.money = user.money - item.price
            })
            .catch((error) => {
                if (error.response && error.response.status === 400) {
                    alert(t('store.insufficientFunds'));
                } else {
                    console.error('Error making purchase:', error);
                    alert(t('store.purchaseError'));
                }
            });
    };

	if (loading) {
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
