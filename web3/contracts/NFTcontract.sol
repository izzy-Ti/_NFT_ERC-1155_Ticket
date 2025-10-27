// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC1155Base.sol";

contract NFTcontract is ERC1155Base {
      constructor(
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    )
        ERC1155Base(
            owner.sender ,
            _name,
            _symbol,
            _royaltyRecipient,
            _royaltyBps
        )
        {}

        struct ticket {
            address owner;
            uint256 UnitPrice;
        }
        mapping(uint256 => ticket) public tickets ;
        function mint(address _to, uint256 _id, uint256 _amount, bytes memory _data) public {
            
        }
    

}