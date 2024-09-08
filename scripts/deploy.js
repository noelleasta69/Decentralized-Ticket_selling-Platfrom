// Importing the Hardhat library
const hre = require("hardhat");

// Function to convert a numerical value to Ethereum wei units
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

// Asynchronous main function
async function main() {
  // Getting the deployer's signer account
  const [deployer] = await ethers.getSigners();

  // Constants for token name and symbol
  const NAME = "TokenMaster";
  const SYMBOL = "TM";

  // Deploying the contract
  const TokenMaster = await ethers.getContractFactory("TokenMaster");
  const tokenMaster = await TokenMaster.deploy(NAME, SYMBOL);
  await tokenMaster.deployed();

  // Logging contract deployment address
  console.log(`Deployed TokenMaster Contract at: ${tokenMaster.address}\n`);

  // Array of occasions with details
  const occasions = [
    {
      name: "MI vs CSK",
      cost: tokens(3),
      tickets: 0,
      date: "May 31",
      time: "7:30PM IST",
      location: "Wankhede Stadium - Mumbia, Maharashtra",
    },
    {
      name: "ETH Tokyo",
      cost: tokens(1),
      tickets: 125,
      date: "Jun 2",
      time: "1:00PM JST",
      location: "Tokyo, Japan",
    },
    {
      name: "ETH Privacy Hackathon",
      cost: tokens(0.25),
      tickets: 200,
      date: "Jun 9",
      time: "10:00AM TRT",
      location: "Turkey, Istanbul",
    },
    {
      name: "RCB vs SRH",
      cost: tokens(1.5),
      tickets: 125,
      date: "April 23",
      time: "11:00AM IST",
      location: "Chinnaswami Stadium, Banglore",
    },
  ];

  // Loop through each occasion and list it
  for (var i = 0; i < occasions.length; i++) {
    // Listing an occasion by calling the list function of the contract
    const transaction = await tokenMaster
      .connect(deployer)
      .list(
        occasions[i].name,
        occasions[i].cost,
        occasions[i].tickets,
        occasions[i].date,
        occasions[i].time,
        occasions[i].location
      );

    // Wait for the transaction to be confirmed
    await transaction.wait();
  }
}

// Call the main function and handle errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
