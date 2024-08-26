import React, { useContext, useState } from "react";
import {
	ShopContainer,
	CoinsDisplay,
	SkinsGrid,
	SkinCard,
	SkinImage,
	SkinPrice,
	BuyButton,
	SkinName
} from "./styles/Shop.styled";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/api";

const skins = [
	{ id: 1, name: "Red", price: 100, img: "/images/skins/red.jpeg" },
	{ id: 2, name: "Neon", price: 150, img: "/images/skins/neon.jpeg" },
	{ id: 3, name: "Galaxy", price: 250, img: "/images/skins/galaxy.jpeg" },
	{ id: 4, name: "Luxury", price: 300, img: "/images/skins/luxury.jpeg" },
	{ id: 5, name: "Pepe", price: 1000, img: "/images/skins/pepe.jpeg" },
];

const Shop = () => {
	const [purchasedSkins, setPurchasedSkins] = useState([]);
	const { user } = useContext(AuthContext);

	const handlePurchase = (skin) => {
		if (user.money >= skin.price) {
			API.patch(`/users/@me/profile`, { money: user.money - skin.price })
				.then(() => console.log('User bought a skin'))
				.catch((err) => console.error(err));
			setPurchasedSkins([...purchasedSkins, skin.id]);
			alert(`You purchased ${skin.name}!`);
		} else {
			alert("Not enough coins!");
		}
	};

	return (
		<ShopContainer>
			<CoinsDisplay>Coins: {user.money} 🪙</CoinsDisplay>
			<SkinsGrid>
				{skins.map((skin) => (
					<SkinCard key={skin.id}>
						<SkinImage src={skin.img} alt={skin.name} />
						<SkinName>{skin.name}</SkinName>
						<SkinPrice>{skin.price} 🪙</SkinPrice>
						<BuyButton
							disabled={purchasedSkins.includes(skin.id)}
							onClick={() => handlePurchase(skin)}
						>
							{purchasedSkins.includes(skin.id) ? "Purchased" : "Buy"}
						</BuyButton>
					</SkinCard>
				))}
			</SkinsGrid>
		</ShopContainer>
	);
}

export default Shop;
