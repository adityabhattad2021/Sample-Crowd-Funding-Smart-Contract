const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { developementChains } = require("../../helper-hardhat-config");

// Using ternary operator👇.
!developementChains?.includes(network.name)
  ? describe.skip
  : describe("FundMe", () => {
      let fundMe;
      let deployer;
      let mockV3Aggregator;
      const sendValue = ethers.utils.parseEther("2");
      beforeEach(async function() {
        // Deploy a New FundMe Contract.
        // Using HardHat Deploy.

        // With plain ethers we can do it like this:
        // const accounts = await ethers.getSigners()
        // const accountZero = accounts[0]

        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe");
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });
      describe("Constructor", () => {
        it("Sets the aggregator addressess correctly", async function() {
          const response = await fundMe.s_priceFeed();
          assert.equal(mockV3Aggregator.address, response);
        });
        it("Sets the contract owner correctly", async function() {
          const response = await fundMe.i_Owner();
          assert.equal(deployer, response);
        });
      });
      describe("FundInWEI", () => {
        it("Fails if enough ETH is not sent", async function() {
          await expect(fundMe.fundInWEI()).to.be.revertedWith(
            "Not Enough Funds Sent!"
          );
        });
        it("Correctly updates the amount funded by the funder", async function() {
          await fundMe.fundInWEI({ value: sendValue });
          const response = await fundMe.s_amtSentFromAddress(deployer);
          //   console.log(`Response is ${response}`);
          //   console.log(`sentValue is ${sendValue}`);
          assert.equal(response.toString(), sendValue);
        });
        it("Correctly adds successful funders to the list of funders", async function() {
          await fundMe.fundInWEI({ value: sendValue });
          const response = await fundMe.s_funders(0);
          assert.equal(response, deployer);
        });
      });
      describe("Withdraw", () => {
        beforeEach(async function() {
          await fundMe.fundInWEI({ value: sendValue });
        });
        it("Withdraw ETH to a single founder", async function() {
          // Arrange
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );
          // Act
          const transectionResponce = await fundMe.effectiveWithdraw();
          const transectionRecipt = await transectionResponce.wait(1);
          const { gasUsed, effectiveGasPrice } = transectionRecipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);
          // Assert
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );
          assert.equal(endingFundMeBalance, 0);
          assert.equal(
            startingDeployerBalance.add(startingFundMeBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          );
        });
        it("Withdraw ETH to a single founder by multiple users and then sender accounts are reset properly from the contract", async function() {
          const accounts = await ethers.getSigners();
          for (let x = 1; x < 6; x++) {
            const connectedFundMeContract = await fundMe.connect(accounts[x]);
            await connectedFundMeContract.fundInWEI({ value: sendValue });
          }
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );
          const transectionResponce = await fundMe.effectiveWithdraw();
          const transectionRecipt = await transectionResponce.wait(1);
          const { gasUsed, effectiveGasPrice } = transectionRecipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);
          const endingingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          assert.equal(endingingFundMeBalance, 0);
          assert.equal(
            startingDeployerBalance
              .add(startingFundMeBalance)
              .sub(gasCost)
              .toString(),
            endingDeployerBalance.toString()
          );

          // make sure s_funders are reset properly
          await expect(fundMe.s_funders(0)).to.be.reverted;

          for (let i = 0; i < 6; i++) {
            assert.equal(
              await fundMe.s_amtSentFromAddress(accounts[i].address),
              0
            );
          }
        });
        it("Only allows the deployer of the contract to withdraw the funds present in the contract", async function() {
          const accounts = await ethers.getSigners();
          const userConnectedFundMe = await fundMe.connect(accounts[3]);
          await expect(
            userConnectedFundMe.effectiveWithdraw()
          ).to.be.revertedWithCustomError(
            userConnectedFundMe,
            "FundMe__NotOwner"
          );
        });
      });
    });
