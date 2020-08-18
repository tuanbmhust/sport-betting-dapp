// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

import "./SafeMath.sol";

contract BetApp {
    using SafeMath for uint256;

    uint256 public minBet;
    uint256 private teamOneBet;
    uint256 private teamTwoBet;
    uint256 public betNumber;
    
    address public owner;
    address payable[] public players;
    
    struct Player{
        uint256 betAmount;
        uint teamSelected;
    }
    
    mapping(address => Player) public playerInfo;
    mapping(address => uint256) private _balance;
    mapping(uint256 => address) private _ownerOf;
    mapping(uint256 => address) approvals;

    constructor() public{
        owner = msg.sender;
        minBet = 100000000000000; //0.0001 ETH
    }
    
    function checkPlayerExisted(address payable _player) public view returns(bool) {
        for(uint64 i = 0; i < players.length; i++){
            if(players[i] == _player) return true;
        }
        return false;
    }
    
    modifier betCondition(){
        require(!checkPlayerExisted(msg.sender), "Player Existed");
        require(msg.value >= minBet, "Minimum value of bet is 0.0001 ETH");
        _;
    }
    
    function _generateRandomWinner() private view returns (uint256) {
        uint256 seed = uint256(keccak256(abi.encodePacked(
        block.timestamp + block.difficulty +
        ((uint256(keccak256(abi.encodePacked(block.coinbase)))) / (block.timestamp)) +
        block.gaslimit + 
        ((uint256(keccak256(abi.encodePacked(msg.sender)))) / (block.timestamp)) +
        block.number
    )));

    return (seed%2+1);
  }
    
    function bet(uint _teamSelected) public payable betCondition {
        require((_teamSelected == 1 || _teamSelected == 2), "Team selected must be 1 or 2");
        playerInfo[msg.sender].betAmount = msg.value;
        playerInfo[msg.sender].teamSelected = _teamSelected;
        
        players.push(msg.sender);
        
        if(_teamSelected == 1) teamOneBet = teamOneBet.add(msg.value);
        else teamTwoBet = teamTwoBet.add(msg.value);
    }
    
    function distributePrize() public returns (uint256){
        uint64 winnerCount = 0;
        uint256 winnerBetAmount = 0;
        uint256 loserBetAmount = 0;
        
        uint256 _winnerTeam = _generateRandomWinner();
        
        //Setting up which team is winner
        if(_winnerTeam == 1){   //Team 1 is the winner
            winnerBetAmount = teamOneBet;
            loserBetAmount = teamTwoBet;
        } else {    //Team 2
            winnerBetAmount = teamTwoBet;
            loserBetAmount = teamOneBet;
        }
        
        //Transfer money
        for(uint64 i = 0; i < players.length; i++){
            address playerAddress = players[i];
            
            if(playerInfo[playerAddress].teamSelected == _winnerTeam){
                winnerCount++;
                uint256 bets = playerInfo[playerAddress].betAmount;
                players[i].transfer(bets + bets*loserBetAmount/winnerBetAmount);
            }
        }
        
        //Reset state
        delete players;
        winnerBetAmount = 0;
        loserBetAmount = 0;
        resetBetAmount();
        
        return _winnerTeam;
    }
    
    function teamOneAmount() public view returns(uint256) {
        return teamOneBet;
    }
    
    function teamTwoAmount() public view returns(uint256) {
        return teamTwoBet;
    }
    
    function resetBetAmount() private {
        teamOneBet = 0;
        teamTwoBet = 0;
    }
}