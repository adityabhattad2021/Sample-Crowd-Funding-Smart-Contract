//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
// StateVariables: These are the variables whose values are permenantly stored 
// in the contract storage even after the functions they are declared 
// in are executed.
// Local Variables: Variables whose values are present till function is executing.
// A Library Cannot have State Variables and all the functions in Library are Internal.
// A Library cannot inherit any element.
// A Library cannot be inherited.

library PriceConverter{

    function getPrice(AggregatorV3Interface priceFeed) internal view returns(uint256) 
    {
        /*
        To Interact with contract outside of our project we will need its
`       ABI:Application Binary Interface
        Address:0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        (Took From : https://docs.chain.link/docs/ethereum-addresses/) (Rinkesby Testnet)
        */
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();

        // This is price of ETH in terms of USD.
        return uint256(price * 1e10);

    }

    function getVersion() internal view returns(uint256)
    {
        AggregatorV3Interface priceFeed=AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
        return priceFeed.version();
    }

    function getConversionRate(uint256 ethAmount,AggregatorV3Interface priceFeed) internal view returns(uint256){
        uint256 ethPrice=getPrice(priceFeed);
        uint256 ethAmtInUSD=(ethPrice*ethAmount)/1e18;
        return ethAmtInUSD;
    }

}