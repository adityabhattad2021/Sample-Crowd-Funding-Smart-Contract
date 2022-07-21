const { getNamedAccounts, ethers } = require("hardhat");


// A reminder to do it like this "yarn hardhat run scripts/fund.js --network localhost" on localhost.
async function main() {
    const {deployer} = await getNamedAccounts()
    const fundMe  = await ethers.getContract("FundMe",deployer)
    console.log("Funding Contract");
    const transectionResponce=await fundMe.fundInWEI({
        value:ethers.utils.parseEther("0.5"),
    })
    const transectionRecipt=transectionResponce.wait(1)
    console.log("Funded Successfully!");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
