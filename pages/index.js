import React, { useState, useEffect, useContext } from "react";

//INTERNAL IMPORT
import Style from "../styles/index.module.css";
import {
  HeroSection,
  Service,
  BigNFTSlider,
  Subscribe,
  Slider,
  Title,
  Category,
  Filter,
  NFTCard,
  Collection,
  FollowerTab,
  AudioLive,
  Brand,
  Video,
} from "../components/ComponentsIndex"; //"../componentsindex"; //"../components/componentsIndex";

//IMPORTING CONTRACT DATA

import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const Home = () => {
  const { checkIfWalletConnected } = useContext(NFTMarketplaceContext);
  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  return (
    <div className={Style.homePage}>
      <HeroSection />
      <Service />
      <BigNFTSlider />
      <Title
        heading="Audio Collection"
        paragraph="Discover the most outstanding NFTs in all topics of life."
      />
      <AudioLive />
      <FollowerTab />
      <Collection />
      <Slider />
      <Subscribe />
      <Brand />
      <Title
        heading="Featured NFTs"
        paragraph="Discover the most outstanding NFTs in all topics of life."
      />
      <Category />
      <Filter />
      <NFTCard />
    </div>
  );
};

export default Home;
