// When we run command "yarn hardhat deploy" the files in deploy folder will automatically start running.
const {
  networkConfig,
  developementChains,
} = require("../helper-hardhat-config");
const { network } = require("hardhat");

/*this two 👇 comes from hardhat runtime environment*/
module.exports = async ({ getNamedAccounts, deployments }) => {
  // console.log("Hello from hardhat deploy!");
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  /*
    When we will work on different chains the priceFeedAggregator (in PriceConverter.sol) will be needed to be changed to do that: 
    */

  let ethUSDPriceFeedAddress;
  if (developementChains.includes(network.name)) {
    const ethUSDAggrigator = await deployments.get("MockV3Aggregator");
    ethUSDPriceFeedAddress = ethUSDAggrigator.address;
  } else {
    ethUSDPriceFeedAddress = networkConfig[chainId]["ethUSDPriceFeed"];
  }

  /* If we will test the smart contracts on local hosts 
    we will need to do mocking: that is if the aggeratorV3Interface contract does not exists we deploy a minimal version of it for our local testing.*/

  const FundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUSDPriceFeedAddress], // we pass this args to the constructor of the contract
    log: true,
    waitConfirmations:network.config.blockConfirmations || 1,
  });



};

module.exports.tags = ["all", "fundme"];
// Deploy only fundme with "yarn hardhat deploy --tags fundme".
