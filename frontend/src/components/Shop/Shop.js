import React, { useState } from "react";
import { ShopContainer } from "./styles/Shop.styled";
import { CoinsDisplay } from "./styles/Shop.styled";
import { SkinsGrid } from "./styles/Shop.styled";
import { SkinCard } from "./styles/Shop.styled";
import { SkinImage } from "./styles/Shop.styled";
import { SkinDetails } from "./styles/Shop.styled";
import { SkinPrice } from "./styles/Shop.styled";
import { BuyButton } from "./styles/Shop.styled";
import { SkinName } from "./styles/Shop.styled";

const skins = [
	{ id: 1, name: "Classic Red", price: 100, img: "path/to/red-skin.png" },
	{ id: 2, name: "Blue Neon", price: 150, img: "path/to/blue-skin.png" },
	{ id: 3, name: "Galaxy", price: 250, img: "path/to/galaxy-skin.png" },
	{ id: 4, name: "Fire", price: 300, img: "path/to/fire-skin.png" },
	{ id: 5, name: "Classic Red", price: 100, img: "path/to/red-skin.png" },
	{ id: 6, name: "Blue Neon", price: 150, img: "path/to/blue-skin.png" },
	{ id: 7, name: "Galaxy", price: 250, img: "path/to/galaxy-skin.png" },
	{ id: 8, name: "Fire", price: 300, img: "path/to/fire-skin.png" },
	// Add more skins here...
];

const Shop = () => {
	const [coins, setCoins] = useState(500); // User's available coins
	const [purchasedSkins, setPurchasedSkins] = useState([]);

	const handlePurchase = (skin) => {
		if (coins >= skin.price) {
		setCoins(coins - skin.price);
		setPurchasedSkins([...purchasedSkins, skin.id]);
		alert(`You purchased ${skin.name}!`);
		} else {
		alert("Not enough coins!");
		}
	};

	return (
		<ShopContainer>
			<CoinsDisplay>Coins: 0 🪙</CoinsDisplay>
			<SkinsGrid>
				{skins.map((skin) => (
				<SkinCard key={skin.id}>
					<SkinImage src={skin.img} alt={skin.name} />
					<SkinDetails>
					<SkinName>{skin.name}</SkinName>
					<SkinPrice>{skin.price} Coins</SkinPrice>
					<BuyButton
						disabled={purchasedSkins.includes(skin.id)}
						onClick={() => handlePurchase(skin)}
					>
						{purchasedSkins.includes(skin.id) ? "Purchased" : "Buy"}
					</BuyButton>
					</SkinDetails>
				</SkinCard>
				))}
			</SkinsGrid>
		</ShopContainer>
	);
}

export default Shop;
