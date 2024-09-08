// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

// Importing OpenZeppelin's ERC721 contract
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Contract definition inheriting from ERC721
contract TokenMaster is ERC721 {
    // State variables
    address public owner;
    uint256 public totalOccasions;
    uint256 public totalSupply;

    // Struct defining an Occasion
    struct Occasion {
        uint256 id;
        string name;
        uint256 cost;
        uint256 tickets;
        uint256 maxTickets;
        string date;
        string time;
        string location;
    }

    // Mapping to store Occasions
    mapping(uint256 => Occasion) occasions;

    // Mapping to track whether an address has bought a ticket for a specific occasion
    mapping(uint256 => mapping(address => bool)) public hasBought;

    // Mapping to store which seat is taken by whom for each occasion
    mapping(uint256 => mapping(uint256 => address)) public seatTaken;

    // Mapping to store all seats taken for each occasion
    mapping(uint256 => uint256[]) seatsTaken;

    // Modifier to restrict access to only the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // Constructor initializing contract with name and symbol
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    // Function to list a new occasion
    function list(
        string memory _name,
        uint256 _cost,
        uint256 _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location
    ) public onlyOwner {
        totalOccasions++;
        occasions[totalOccasions] = Occasion(
            totalOccasions,
            _name,
            _cost,
            _maxTickets,
            _maxTickets,
            _date,
            _time,
            _location
        );
    }

    // Function to mint a ticket for an occasion
    function mint(uint256 _id, uint256 _seat) public payable {
        require(_id != 0); // Ensure occasion ID is valid
        require(_id <= totalOccasions); // Ensure occasion exists

        require(msg.value >= occasions[_id].cost); // Check if sent ETH is enough

        require(seatTaken[_id][_seat] == address(0)); // Check if seat is available
        require(_seat <= occasions[_id].maxTickets); // Ensure seat number is valid

        occasions[_id].tickets -= 1; // Decrease available tickets

        hasBought[_id][msg.sender] = true; // Mark sender as having bought a ticket
        seatTaken[_id][_seat] = msg.sender; // Assign the seat to the sender

        seatsTaken[_id].push(_seat); // Add the seat to the list of taken seats

        totalSupply++;

        _safeMint(msg.sender, totalSupply); // Mint the NFT
    }

    // Function to retrieve an occasion's details
    function getOccasion(uint256 _id) public view returns (Occasion memory) {
        return occasions[_id];
    }

    // Function to retrieve all seats taken for an occasion
    function getSeatsTaken(uint256 _id) public view returns (uint256[] memory) {
        return seatsTaken[_id];
    }

    // Function to withdraw contract balance, accessible only by owner
    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }

    // Add event functionality
    // address[] venueOwners;

    // function addVenueOwner(address venueOwner) public onlyOwner {
    //     venueOwners.push(venueOwner);
    // }

    // function checkOwner(address caller) internal view returns (bool) {
    //     bool isValidOwner = false;
    //     for (uint256 i = 0; i < venueOwners.length; i++) {
    //         if (venueOwners[i] == caller) {
    //             isValidOwner = true;
    //             break;
    //         }
    //     }
    //     return isValidOwner;
    // }

    // modifier venueOwnerOnly() {
    //     require(checkOwner(msg.sender));
    //     _;
    // }

    // function addEvent(
    //     string memory _name,
    //     uint256 _cost,
    //     uint256 _maxTickets,
    //     string memory _date,
    //     string memory _time,
    //     string memory _location
    // ) public venueOwnerOnly {
    //     list(_name, _cost, _maxTickets, _date, _time, _location);
    // }

    // uint256 constant ownerSharePercentage = 20;

    // function withdraw() public onlyOwner {
    //     uint256 contractBalance = address(this).balance;
    //     require(contractBalance > 0, "No balance to withdraw");

    //     uint256 ownerCut = (contractBalance * ownerSharePercentage) / 100;
    //     uint256 venueOwnerCut = contractBalance - ownerCut;

    //     // Transfer owner's share
    //     (bool ownerSuccess, ) = owner.call{value: ownerCut}("");
    //     require(ownerSuccess, "Failed to send owner's share");

    //     // Transfer venue owner's share
    //     address payable venueOwner = payable(msg.sender);
    //     (bool venueOwnerSuccess, ) = venueOwner.call{value: venueOwnerCut}("");
    //     require(venueOwnerSuccess, "Failed to send venue owner's share");
    // }
}
