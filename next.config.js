/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // it should be false by default

  images: {
    //domains: ["njan.infura-ipfs.io", "infura-ipfs.io"],
    domains: ["njan.infura-ipfs.io", "ipfs.infura.io"],
  },
};

module.exports = nextConfig;
