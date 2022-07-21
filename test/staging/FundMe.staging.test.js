const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { developementChains } = require("../../helper-hardhat-config");


developementChains?.includes(network.name)
  ? describe.skip
  :describe("FundMe", function() {
      let fundMe;
      let deployer;
      const sendValue = ethers.utils.parseEther("1");
      beforeEach(async function() {
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe", deployer);
      });
      it("Allows Poeple to fund and withdraw", async function() {
        await fundMe.fund({ value: sendValue });
        await fundMe.effectiveWithdraw();
        const endingBalance = await fundMe.provider.getBalance(fundMe.address);
        assert.equal(endingBalance.toString(), "0");
      });
    });
