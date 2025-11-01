// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC1155Base.sol";

contract NFTcontract is ERC1155Base {
    address public admin;
      constructor(
        address _defaultAdmin,
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    )
        ERC1155Base(
            msg.sender ,
            _name,
            _symbol,
            _royaltyRecipient,
            _royaltyBps
        )
        {
            admin =  msg.sender;
        }
        uint256 public NoOfTickets = 0;
        mapping(uint256 => string) public tokenURIs;
        mapping(uint256 => uint256) public maxSupply;
        mapping(uint256 => uint256) public totalMinted;


        struct ticket {
            address owner;
            uint amount;
            uint256 UnitPrice;
        }
        mapping(uint256 => ticket) public tickets ;
        function mint(address _to, uint256 _amount, uint _UnitPrice, bytes memory _data, string memory _uri) public returns(uint256){
            require(msg.sender == admin , 'Sorry you must be an admin');

            ticket storage Ticket = tickets[NoOfTickets];

            Ticket.owner = _to;
            Ticket.amount = _amount;
            Ticket.UnitPrice = _UnitPrice;

            //mint the NFT for the admin or seller contrac
            _mint(_to, NoOfTickets, _amount, _data);


            //setting the token uri(NFT image link)
            tokenURIs[NoOfTickets] = _uri;
            NoOfTickets ++ ;
            return NoOfTickets - 1;
        }

        function setMaxSupply(uint256 _id, uint256 _max) public {
            require(msg.sender == admin , 'Sorry you must be an admin');
            maxSupply[_id] = _max;
        }

        function buyTicket(uint256 _id, uint256 _amount) public payable {
            require(maxSupply[_id] < _amount, "Incorrect amount");
            uint price = tickets[_id].UnitPrice * _amount;
            require(msg.value != price, "Incorrect ETH sent");
            tickets[_id].amount -= _amount;
            _mint(msg.sender, _id, _amount, "");
        }

    

}