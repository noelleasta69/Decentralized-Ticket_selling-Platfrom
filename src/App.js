import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Navigation from "./components/Navigation";
import Card from "./components/Card";
import SeatChart from "./components/SeatChart";
import Footer from "./components/Footer";

// ABIs
import TokenMaster from "./abis/TokenMaster.json";

// Config
import config from "./config.json";

function App() {
  // To Dos
  // 1. Add search funtionality
  // 2. Add resell funtionality
  // 3. Introduce add event functionality (only for admin)

  // State variables for Ethereum connection and contract interaction
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);

  const [tokenMaster, setTokenMaster] = useState(null);
  const [occasions, setOccasions] = useState([]);

  // State variable to store current occasion details and toggle seat chart visibility
  const [occasion, setOccasion] = useState({});
  const [toggle, setToggle] = useState(false);

  // Function to load blockchain data
  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    const tokenMaster = new ethers.Contract(
      config[network.chainId].TokenMaster.address,
      TokenMaster,
      provider
    );
    setTokenMaster(tokenMaster);

    const totalOccasions = await tokenMaster.totalOccasions();
    const occasions = [];

    for (var i = 1; i <= totalOccasions; i++) {
      const occasion = await tokenMaster.getOccasion(i);
      occasions.push(occasion);
    }

    setOccasions(occasions);

    window.ethereum.on("accountsChanged", async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    });
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <header>
        {/* Navigation component */}
        <Navigation
          account={account}
          setAccount={setAccount}
          occasions={occasions}
          tokenMaster={tokenMaster}
          provider={provider}
          setOccasion={setOccasion}
        />

        {/* Page title */}
        <h2 className="header__title">
          <strong>Event</strong> Tickets
        </h2>
      </header>

      <div className="cards">
        {/* Mapping occasions to Card components */}
        {occasions.map((occasion, index) => (
          <Card
            occasion={occasion}
            id={index + 1}
            tokenMaster={tokenMaster}
            provider={provider}
            account={account}
            toggle={toggle}
            setToggle={setToggle}
            setOccasion={setOccasion}
            key={index}
          />
        ))}
      </div>

      {/* Display SeatChart component if toggle state is true */}
      {toggle && (
        <SeatChart
          occasion={occasion}
          tokenMaster={tokenMaster}
          provider={provider}
          setToggle={setToggle}
        />
      )}
      <Footer />
    </div>
  );
}

export default App;
