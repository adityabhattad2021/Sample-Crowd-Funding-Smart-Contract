/*
    This Contract will:
        Get funds from the users
        Withdraw Funds
        Set a Minimum Funding Value in USD
*/

/* 
    Blockchain Oracle: Any device that interacts with the off-chain world to provide external data 
    or computation to the smart contracts.
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PriceConverter.sol";

error FundMe__NotOwner();

/** @title A Contract to Fund a Project
 *  @dev This contract will allow users to fund a project.
 *  @dev The contract will also allow the owner to withdraw funds.
 *  @dev The contract will also allow the owner to set a minimum funding value.
 *  @notice This is to demo a sample funding contract
 *  @author Aditya Bhattad
 */
contract FundMe {
    // Gas optimisations keyword:constant and immutable.(Learn more later).

    // s_variable is a state variable and is gas expensive.
    // c_variable is a constant and is not gas expensive.
    // i_variable is an immutable variable and is not gas expensive.
    // r_variable is a return variable and is not gas expensive.

    address public immutable i_Owner;

    AggregatorV3Interface public s_priceFeed;

    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 50 * 1e18;

    address[] public s_funders;
    mapping(address => uint256) public s_amtSentFromAddress;

    // Modifier in Solidity..
    modifier onlyOwner() {
        

        // to save gas we are using alternative of this.
        // require(msg.sender==i_owner,"Only owner can use withdraw function");

        // This means wherever this tag(i.e. onlyOwner) is added the
        // code in that function will be run in the order below .

        // first this line.👇

        if (msg.sender != i_Owner) {
            revert FundMe__NotOwner();
        }

        //  and then rest of the code present in that function.
        // _;: represents rest of the code present in the function
        // in which modifier tag is added.
        _;
    }

    // Basic Constructor in Solidity.
    constructor(address priceFeedAddress) {
        i_Owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    // what happens if some one sends this contract ETH without calling fund function.
    receive() external payable {
        fundInWEI();
    }

    fallback() external payable {
        fundInWEI();
    }

    // Payble keyword allows this contract to hold gas.
    function fundInWEI() public payable {
        // Want to be able to set a minimum fund amount in USD
        // 1. How do we send ETH to this contract?
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
            "Not Enough Funds Sent!"
        ); // as the money math is done inn wei therefore 1e18=1*10**18.
        // if the above condition isn't met the function will revert any previously done by it and return.
        s_funders.push(msg.sender);
        s_amtSentFromAddress[msg.sender] += msg.value;
    }

    // Adding modifier onlyOwner created below.

    // This function works well but it is not gas efficient.

    // function withdraw() public onlyOwner {
    //     for (
    //         uint256 funderIndex = 0;
    //         funderIndex < s_funders.length;
    //         funderIndex++
    //     ) {
    //         address _funder = s_funders[funderIndex];
    //         s_amtSentFromAddress[_funder] = 0;
    //     }
    //     // Resetting the array.
    //     s_funders = new address[](0);
    //     (bool callSuccess, ) = payable(msg.sender).call{
    //         value: address(this).balance
    //     }("");
    //     require(callSuccess, "Call Failed");
    // }

    // This function is gas efficient.

    function effectiveWithdraw() public onlyOwner {
        address[] memory funders = s_funders;
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address _funder = funders[funderIndex];
            s_amtSentFromAddress[_funder] = 0;
        }
        s_funders = new address[](0);
        (bool callSuccess, ) = i_Owner.call{value: address(this).balance}("");
        require(callSuccess, "Withdraw Call Failed!");
    }




}

// function getConversionRates(uint256 ethAmt) public view returns (uint256) {
//     return PriceConverter.getConversionRate(ethAmt);
// }
