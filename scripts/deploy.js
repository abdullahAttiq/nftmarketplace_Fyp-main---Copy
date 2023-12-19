// const hre = require("hardhat");

// async function main() {
//   // We get the contract to deploy
//   // const Greeter = await hre.ethers.getContractFactory("Greeter");
//   // const greeter = await Greeter.deploy("Hello, Hardhat!");
//   const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
//   const nftMarketplace = await NFTMarketplace.deploy();

//   await nftMarketplace.deployed();

//   console.log(" deployed contract address:", nftMarketplace.address);
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });

const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  // const Greeter = await hre.ethers.getContractFactory("Greeter");
  // const greeter = await Greeter.deploy("Hello, Hardhat!");
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy();

  await nftMarketplace.deployed();

  console.log(" deployed contract address:", nftMarketplace.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
