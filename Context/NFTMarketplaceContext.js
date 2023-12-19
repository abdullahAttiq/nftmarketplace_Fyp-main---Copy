import React, { useState, useEffect, useContext } from "react";
import Web3Modal from "web3modal";
import { Signer, errors, ethers } from "ethers";
import Router, { useRouter } from "next/router";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";

//const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const projectId = "2Uio7VguTWZ4W0N9cwQwRzWP67N";
const projectSecretKey = "31845da3c8eba8ca7a9ad3893ce10dfc";

const auth = `Basic ${Buffer.from(`${projectId}:${projectSecretKey}`).toString(
  "base64"
)}`;

const subdomain = "https://njan.infura-ipfs.io";
const client = ipfsHttpClient({
  // host: "infura-ipfs.io",
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

// INTERNAL IMPORT

import { NFTMarketplaceAddress, NFTMarketplaceABI } from "./constants";
// import { create } from "domain";
// import { type } from "os";
// //import { url } from "inspector";

//--FETCHING SMART CONTRACT

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(
    NFTMarketplaceAddress,
    NFTMarketplaceABI,
    signerOrProvider
  );

//---CONNECTING WITH SMART CONTRACT

const connectingWithSmartContract = async () => {
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();
    const contract = fetchContract(signer);
    return contract;
  } catch (error) {
    console.log("somthing went wrong while connecting with contract");
  }
};

export const NFTMarketplaceContext = React.createContext();
const titleData = "Discover the most outstanding NTFs";

export const NFTMarketplaceProvider = ({ children }) => {
  //--USESTATE

  const [currentAccount, setCurrentAccount] = useState("");

  const router = useRouter();

  //--CHECK IF WALLET IS CONNECTED

  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) return console.log("install metamask wallet");

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No Account Found");
      }
      console.log(currentAccount);
    } catch (error) {
      console.log("Somthing went wrong while connecting to wallet");
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  //---CONNECT WALLET FUNCTION

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return console.log("install metamask wallet");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log("error while connecting to wallet");
    }
  };

  //----UPLOAD TO IPFS FUNCTION

  // const uploadToIPFS = async (file) => {
  //   try {
  //     const added = await client.add({ content: file });
  //     const url = `${subdomain}/ipfs/${added.path}`;
  //     return url;
  //   } catch (error) {
  //     console.log("error while upload ");
  //   }
  // };

  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });
      //const url = `${subdomain}/ipfs/${added.path}`;
      // return url;
      return {
        gatewayUrl: `${subdomain}/ipfs/${added.path}`,
        ipfsUrl: `ipfs://${added.path}`,
      };
    } catch (error) {
      console.log("Error while uploading to IPFS:", error);
      throw error;
    }
  };

  // const createNFT = async (name, price, image, description, router) => {
  //   if (!name || !description || !price || !image) {
  //     console.log("Data is Missing");
  //     return;
  //   }

  //   const data = JSON.stringify({ name, description, image });

  //   try {
  //     const added = await client.add(data);

  //     const url = `https://infura-ipfs.io/ipfs/${added.path}`;

  //     await createSale(url, price);
  //   } catch (error) {
  //     console.log("Error:", error);
  //   }
  // };

  // const createSale = async (url, fromInputPrice, isReselling, id) => {
  //   try {
  //     const price = ethers.utils.parseUnits(fromInputPrice, "ether");
  //     const contract = await connectingWithSmartContract();

  //     const listingPrice = await contract.getListingPrice();
  //     const transaction = !isReselling
  //       ? await contract.createToken(url, price, {
  //           value: listingPrice.toString(),
  //         })
  //       : await contract.resellToken(url, price, {
  //           value: listingPrice.toString(),
  //         });

  //     await transaction.wait();

  //     console.log(transaction);
  //   } catch (error) {
  //     console.log("Error while creating sale:", error);
  //   }
  // };

  //---CREATE NFT FUNCTION

  // const createNFT = async (name, price, image, description, router) => {
  //   if (!name || !description || !price || image)
  //     return console.log("Data is Mis  sing");

  //   const data = JSON.stringify({ name, description, image });

  //   try {
  //     const added = await client.add(data);

  //     const url = `https://infura-ipfs.io/ipfs/${added.path}`;

  //     await createSale(url, price);
  //   } catch (error) {
  //     console.log("error");
  //   }
  // };
  const createNFT = async (name, price, image, description, router,royaltyPercentage) => {
    if (!name || !description || !price || !image) {
      console.log("Data is Missing");
      return; // Add this to stop the function execution
    }

    const data = JSON.stringify({ name, description, image });

    try {
      const added = await client.add(data);

      //const url = `https://infura-ipfs.io/ipfs/${added.path}`;
      const url = `ipfs://${added.path}`;
      //const url = `https://ipfs.infura.io/${added.path}`;

      console.log("this is", url);
      await createSale(url, price,royaltyPercentage);
      router.push("/searchPage");
    } catch (error) {
      console.log("Error:", error); // Log the actual error message
    }
  };

  // //--CREATE SALE FUNTION

  const createSale = async (url, fromInputPrice,royaltyPercentage, isReselling, id) => {
    try {
      const price = ethers.utils.parseUnits(fromInputPrice, "ether");
      const contract = await connectingWithSmartContract();
      console.log("connectd >>>>");

      const listingPrice = await contract.getListingPrice();
      //const listingPrice = await contract.getlistPrice();
      const transaction = !isReselling
        ? await contract.createToken(url, price,royaltyPercentage, {
            value: listingPrice.toString(),
          })
        : await contract.resellToken(id, price, {
            value: listingPrice.toString(),
          });

      await transaction.wait();

      console.log(transaction);
    } catch (error) {
      console.log("error while creating sale");
      console.log(error);
    }
  };

  //--FETHING NFTS FUNCTION

  // const fetchNFTs = async () => {
  //   try {
  //     const provider = new ethers.providers.JsonRpcProvider();
  //     const contract = fetchContract(provider);
  //     const data = await contract.fetchMarketItem();
  //     // consloe.log(data)

  //     const item = await Promise.all(
  //       data.map(
  //         async ({ tokenId, seller, owner, price: unformattedPrice }) => {
  //           const tokenURI = await contract.tokenURI();
  //           const {
  //             data: { image, name, description },
  //           } = await axios.get(tokenURI);
  //           const price = ethers.utils.formatUnits(
  //             unformattedPrice.toString(),
  //             "ether"
  //           );
  //           return {
  //             price,
  //             tokenId: tokenId.toNumber(),
  //             seller,
  //             owner,
  //             image,
  //             name,
  //             description,
  //             tokenURI,
  //           };
  //         }
  //       )
  //     );

  //     return item;
  //   } catch (error) {
  //     console.log("error while fetching nfts");
  //   }
  // };

  const fetchNFTs = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const data = await contract.fetchMarketItems();

      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);
            console.log("token UIIIII", tokenURI);
            const tokenURIgateway = tokenURI.replace(
              "ipfs://",
              `${subdomain}/ipfs/`
            );

            const {
              data: { image, name, description },
            } = await axios.get(tokenURIgateway);

            console.log("this is token Uri", tokenURIgateway);
            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );
            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image: image.replace("ipfs://", `${subdomain}/ipfs/`),
              name,
              description,
              tokenURI: tokenURIgateway,
            };
          }
        )
      );

      return items;
    } catch (error) {
      console.error("Error while fetching NFTs:", error);
      throw error; // Rethrow the error to handle it at the calling code level
    }
  };

  useEffect(() => {
    fetchNFTs();
    console.log(fetchNFTs());
  }, []);

  //--FETCHING MY NFT OR LISTED NFTS

  const fetchMyNFTOrListedNFTs = async (type) => {
    try {
      const contract = await connectingWithSmartContract();
      const data =
        type == "fetchItemListed"
          ? await contract.fetchItemsListed()
          : await contract.fetchMyNFTs();

      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);
            const tokenURIgateway = tokenURI.replace(
              "ipfs://",
              `${subdomain}/ipfs/`
            );
            const {
              data: { image, name, description },
            } = await axios.get(tokenURIgateway);

            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );
            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              image: image.replace("ipfs://", `${subdomain}/ipfs/`),
              name,
              description,
              tokenURI,
            };
          }
        )
      );
      return items;
    } catch (error) {
      console.log("error while fetching listed nfts");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMyNFTOrListedNFTs();
  }, []);

  //--BUY NFTS FUNCTION

  const buyNFT = async (nft) => {
    try {
      const contract = await connectingWithSmartContract();
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });
      await transaction.wait();
      router.push("./author");
    } catch (error) {
      console.log("error while buying nfts");
      console.log(error);
    }
  };

  return (
    <NFTMarketplaceContext.Provider
      value={{
        checkIfWalletConnected,
        connectWallet,
        uploadToIPFS,
        createNFT,
        fetchNFTs,
        fetchMyNFTOrListedNFTs,
        buyNFT,
        createSale,
        currentAccount,
        titleData,
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  );
};






// import React, { useState, useEffect } from "react";
// import Web3Modal from "web3modal";
// import { ethers } from "ethers";
// import Router, { useRouter } from "next/router";
// import axios from "axios";
// import { create as ipfsHttpClient } from "ipfs-http-client";

// const projectId = "2Uio7VguTWZ4W0N9cwQwRzWP67N";
// const projectSecretKey = "31845da3c8eba8ca7a9ad3893ce10dfc";

// const auth = `Basic ${Buffer.from(`${projectId}:${projectSecretKey}`).toString(
//   "base64"
// )}`;

// const subdomain = "https://njan.infura-ipfs.io";
// const client = ipfsHttpClient({
//   host: "ipfs.infura.io",
//   port: 5001,
//   protocol: "https",
//   headers: {
//     authorization: auth,
//   },
// });

// import { NFTMarketplaceAddress, NFTMarketplaceABI } from "./constants";

// const fetchContract = (signerOrProvider) =>
//   new ethers.Contract(
//     NFTMarketplaceAddress,
//     NFTMarketplaceABI,
//     signerOrProvider
//   );

// export const NFTMarketplaceContext = React.createContext();
// const titleData = "Discover the most outstanding NFTs";

// export const NFTMarketplaceProvider = ({ children }) => {
//   const [currentAccount, setCurrentAccount] = useState("");

//   const router = useRouter();

//   const checkIfWalletConnected = async () => {
//     try {
//       if (!window.ethereum) return console.log("Install MetaMask wallet");

//       const accounts = await window.ethereum.request({
//         method: "eth_accounts",
//       });

//       if (accounts.length) {
//         setCurrentAccount(accounts[0]);
//       } else {
//         console.log("No Account Found");
//       }
//     } catch (error) {
//       console.log("Something went wrong while connecting to the wallet");
//     }
//   };

//   useEffect(() => {
//     checkIfWalletConnected();
//   }, []);

//   const connectWallet = async () => {
//     try {
//       if (!window.ethereum) return console.log("Install MetaMask wallet");

//       const accounts = await window.ethereum.request({
//         method: "eth_requestAccounts",
//       });

//       setCurrentAccount(accounts[0]);
//       window.location.reload();
//     } catch (error) {
//       console.log("Error while connecting to the wallet");
//     }
//   };

//   const uploadToIPFS = async (file) => {
//     try {
//       const added = await client.add({ content: file });
//       return {
//         gatewayUrl: `${subdomain}/ipfs/${added.path}`,
//         ipfsUrl: `ipfs://${added.path}`,
//       };
//     } catch (error) {
//       console.log("Error while uploading to IPFS:", error);
//       throw error;
//     }
//   };

//   const createNFT = async (name, price, image, description, router,royaltyPercentage) => {
//     if (!name || !description || !price || !image) {
//       console.log("Data is Missing");
//       return;
//     }

//     const data = JSON.stringify({ name, description, image });

//     try {
//       const added = await client.add({ content: data });
//       const url = `ipfs://${added.path}`;
//       await createSale(url, price,royaltyPercentage);
//       router.push("/searchPage");
//     } catch (error) {
//       console.log("Error:", error);
//     }
//   };

//   const createSale = async (url, fromInputPrice,royaltyPercentage, isReselling, id) => {
//     try {
//       const price = ethers.utils.parseUnits(fromInputPrice, "ether");
//       const contract = await connectingWithSmartContract();

//       const listingPrice = await contract.getListingPrice();
//       // const royaltyPercentage = await contract.royaltyPercentage();

//       // const royaltyAmount = (price.mul(royaltyPercentage)).div(100);
//       // const sellerProceeds = price.sub(royaltyAmount);

//       const transaction = !isReselling
//         ? await contract.createToken(url, price,royaltyPercentage, {
//             value: listingPrice.toString(),
//           })
//         : await contract.resellToken(id, price, {
//             value: listingPrice.toString(),
//           });

//       await transaction.wait();

//       console.log(transaction);
//     } catch (error) {
//       console.log("Error while creating sale:", error);
//     }
//   };

//   const fetchNFTs = async () => {
//     try {
//       const provider = new ethers.providers.JsonRpcProvider();
//       const contract = fetchContract(provider);
//       const data = await contract.fetchMarketItems();

//       const items = await Promise.all(
//         data.map(
//           async ({ tokenId, seller, owner, price: unformattedPrice }) => {
//             const tokenURI = await contract.tokenURI(tokenId);
//             const tokenURIgateway = tokenURI.replace(
//               "ipfs://",
//               `${subdomain}/ipfs/`
//             );
//             const {
//               data: { image, name, description },
//             } = await axios.get(tokenURIgateway);

//             const price = ethers.utils.formatUnits(
//               unformattedPrice.toString(),
//               "ether"
//             );
//             return {
//               price,
//               tokenId: tokenId.toNumber(),
//               seller,
//               owner,
//               image: image.replace("ipfs://", `${subdomain}/ipfs/`),
//               name,
//               description,
//               tokenURI: tokenURIgateway,
//             };
//           }
//         )
//       );

//       return items;
//     } catch (error) {
//       console.error("Error while fetching NFTs:", error);
//       throw error;
//     }
//   };

//   useEffect(() => {
//     fetchNFTs();
//   }, []);

//   const fetchMyNFTOrListedNFTs = async (type) => {
//     try {
//       const contract = await connectingWithSmartContract();
//       const data =
//         type === "fetchItemListed"
//           ? await contract.fetchItemsListed()
//           : await contract.fetchMyNFTs();

//       const items = await Promise.all(
//         data.map(
//           async ({ tokenId, seller, owner, price: unformattedPrice }) => {
//             const tokenURI = await contract.tokenURI(tokenId);
//             const tokenURIgateway = tokenURI.replace(
//               "ipfs://",
//               `${subdomain}/ipfs/`
//             );
//             const {
//               data: { image, name, description },
//             } = await axios.get(tokenURIgateway);

//             const price = ethers.utils.formatUnits(
//               unformattedPrice.toString(),
//               "ether"
//             );
//             return {
//               price,
//               tokenId: tokenId.toNumber(),
//               seller,
//               owner,
//               image: image.replace("ipfs://", `${subdomain}/ipfs/`),
//               name,
//               description,
//               tokenURI,
//             };
//           }
//         )
//       );
//       return items;
//     } catch (error) {
//       console.log("Error while fetching listed nfts:", error);
//     }
//   };

//   useEffect(() => {
//     fetchMyNFTOrListedNFTs();
//   }, []);

//   const buyNFT = async (nft) => {
//     try {
//       const contract = await connectingWithSmartContract();
//       const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
//       const transaction = await contract.createMarketSale(nft.tokenId, {
//         value: price,
//       });
//       await transaction.wait();
//       router.push("./author");
//     } catch (error) {
//       console.log("Error while buying nfts:", error);
//     }
//   };

//   const updateRoyaltyPercentage = async (percentage) => {
//     try {
//       const contract = await connectingWithSmartContract();
//       const transaction = await contract.updateRoyaltyPercentage(percentage);
//       await transaction.wait();
//       console.log("Royalty percentage updated successfully");
//     } catch (error) {
//       console.log("Error updating royalty percentage:", error);
//     }
//   };

//   return (
//     <NFTMarketplaceContext.Provider
//       value={{
//         checkIfWalletConnected,
//         connectWallet,
//         uploadToIPFS,
//         createNFT,
//         fetchNFTs,
//         fetchMyNFTOrListedNFTs,
//         buyNFT,
//         createSale,
//         updateRoyaltyPercentage,
//         currentAccount,
//         titleData,
//       }}
//     >
//       {children}
//     </NFTMarketplaceContext.Provider>
//   );
// };
