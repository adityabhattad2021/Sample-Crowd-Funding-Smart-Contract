require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("solidity-coverage");
require("hardhat-deploy");
require("hardhat-gas-reporter")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // solidity: "0.8.9",
  // So that we can compile different contracts which needs different versions.
  solidity:{
    compilers:[{version:"0.8.9"},{version:"0.6.6"}],
  },
  defaultNetwork:"hardhat",
  networks:{
    rinkeby:{
      url:process.env.RINKEBY_RPC_URL,
      accounts:[process.env.PRIVATE_KEY],
      chainId:4,
      blockConfirmations:6,
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: {
      default: 1,
    },
  },
  gasReporter:{
    enabled:true,
    noColors:true,
  }
};
