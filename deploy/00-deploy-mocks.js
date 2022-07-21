const { network, deployments } = require("hardhat");
const {
  developementChains,
  DECIMALS,
  INITIAL_ANSWER,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const networkName = network.name;

  if (developementChains.includes(networkName)) {
    log("----------------------------------------------------");
    log("Local Network Detected! Deploying Mock Contracts.");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    });
    log("Mocks Deployed");
    log("----------------------------------------------------");
  }
};

module.exports.tags = ["all", "mocks"];
// Deploy only fundme with "yarn hardhat deploy --tags mocks".
