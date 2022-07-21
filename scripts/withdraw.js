const { getNamedAccounts,ethers } = require("hardhat")

async function main() {
    const {deployer}=await getNamedAccounts()
    const fundMe=await ethers.getContract(
        "FundMe",
        deployer
    )
    console.log("Withdrawing from the Contract");
    const transectionResponce = await fundMe.effectiveWithdraw()
    const transectionRecipt=await transectionResponce.wait(1)
    console.log("Withdrawn successfull!");
}

main().then(()=>{
    process.exit(0)
}).catch((e)=>{
    console.log(e);
    process.exit(1)
})