import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";

// INTERNAL IMPORT

import Style from "../styles/reSellToken.module.css";
import formStyle from "../AccountPage/Form/Form.module.css";
import { Button } from "../components/componentsindex";

//IMPORT SMART CONTRACT

import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";
const subdomain = "https://njan.infura-ipfs.io";

const reSellToken = () => {
  const { createSale } = useContext(NFTMarketplaceContext);
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const router = useRouter();
  const { id, tokenURI } = router.query;

  const fetchNFT = async () => {
    const tokenURIgateway = tokenURI.replace(
      "ipfs://",
      `${subdomain}/ipfs/`
    );
    if (!tokenURI) return;

    const { data } = await axios.get(tokenURIgateway);

    setImage(data.image);
  };

  useEffect(() => {
    fetchNFT();
  }, [id]);

  const resell = async () => {
    const tokenURIgateway = tokenURI.replace(
      "ipfs://",
      `${subdomain}/ipfs/`
    );
    try {
      await createSale(tokenURIgateway, price,0, true, id);
      router.push("/author");
    } catch (error) {
      console.log("error while resell", error);
    }
  };
  return (
    <div className={Style.reSellToken}>
      <div className={Style.reSellToken_box}>
        <div className={formStyle.Form_box_input}>
          <label htmlFor="name">price</label>
          <input
            type="text"
            placeholder="ReSell Price"
            className={formStyle.Form_box_input_userName}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className={Style.reSellToken_box_image}>
          {image && (
            <Image
              src={image.replace("ipfs://", `${subdomain}/ipfs/`)}
              alt="resell nft"
              width={400}
              height={400}
            ></Image>
          )}
        </div>

        <div className={Style.reSellToken_box_btn}>
          <Button btnName="Resell NFT" handleClick={() => resell()} />
        </div>
      </div>
    </div>
  );
};

export default reSellToken;
