// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.4;


// interface IERC721{
//     function transferFrom(address _from, address _to, uint256 _nftid
//     ) external;
        
    

// }

// contract NftAuction {
//     uint256 private constant DURATION = 7 days;

//     IERC721 public immutable nft;
//     uint256 public immutable nftId;

//     address payable  public  seller;
//     uint256 public  strtingPrice;
//     uint256 public  discountRate;
//     uint256 public  expiresAt;

//     constructor(
//     uint256 _startingPrice,
//     uint256 _discountRate,
//     uint256 _nft,
//     uint256 _nftId
// )
// {
//     seller = payable(msg.sender);
//     startingPrice = _startingPrice;
//     discountRate = _discountRate;
//     startAt = block.timestamp;
//     expiresAt = block.timestamp + DURATION

//     require((_startingPrice >= _discountRate  +  DURATION, "Starting price is too low"));

//     function getPrice() public view returns(uint256){
//         uint256 timeElapsed = block.timestamp - startAt;
//         uint256 discount = discountRate * timeElapsed;

//         return startingPrice - discount;
//     }

//     function buy()external payable{
//         require(block.timestamp < expiresAt, "this nft bidding has ended");
//         uint256 price = getPrice();
//         require(msg.value >=  price, "the amount of ETH send is less then the price");
//         nft.transferFrom(seller, msg.sender, nftId);
//         uint256 refund = msg.value - price;

//         if(refund > 0){
//             payable(msg.sender).transfer(refund);
//         }
//         selfdestruct(seller);
//     }

   
// }



// }


