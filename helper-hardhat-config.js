const networkConfig = {
  4: {
    name: "rinkeby",
    ethUSDPriceFeed: "8A753747A1Fa494EC906cE90E9f37563A8AF630e",
  },
};

const developementChains = ["hardhat", "localhost"];
const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;

module.exports = {
  networkConfig,
  developementChains,
  DECIMALS,
  INITIAL_ANSWER,
};
