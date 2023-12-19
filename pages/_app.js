import "@/styles/globals.css";
import NavBar from "@/components/NavBar/NavBar";
import Footer from "@/components/Footer/Footer";

//INTERNAL IMPORT

import { NFTMarketplaceProvider } from "@/Context/NFTMarketplaceContext";

const App = ({ Component, pageProps }) => (
  /// all the components will not be lord or are change
  //// these would be permanent part of our website
  <div>
    <NFTMarketplaceProvider>
      <NavBar />
      <Component {...pageProps} />
      <Footer />
    </NFTMarketplaceProvider>
  </div>
);

export default App;
