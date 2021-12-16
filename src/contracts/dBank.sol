// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./Token.sol";

contract dBank {

  //assign Token contract to variable
  Token private token;

  //add mappings
  mapping(address => uint) public etherBalanceOf;
  mapping(address => uint) public depositStart;
  mapping(address => bool) public isDeposited;

  //add events
  event Deposit(address indexed user, uint etherAmount, uint timeStart);
  event Withdraw(address indexed user, uint etherAmount, uint depositTime, uint interest);

  constructor(Token _token) public {
    token = _token;
  }

  function deposit() payable public {
    //check if msg.sender didn't already deposited funds
    require(isDeposited[msg.sender]==false,'Error, deposit already active');

    //check if msg.value is >= than 0.01 ETH
    require(msg.value>=1e16,'Error, deposit must be >= 0.01 ETH');

    //increase msg.sender ether deposit balance
    etherBalanceOf[msg.sender] = etherBalanceOf[msg.sender] + msg.value;

    //start msg.sender hodling time
    depositStart[msg.sender] = depositStart[msg.sender] + block.timestamp;
    

    //set msg.sender deposit status to true
    isDeposited[msg.sender] = true;

    //emit Deposit event
    emit Deposit(msg.sender, msg.value, block.timestamp);

  }

  function withdraw() payable public {
    //check if msg.sender deposit status is true
    require(isDeposited[msg.sender] == true, 'Error, no previous deposit');
    uint userBalance = etherBalanceOf[msg.sender];

    //If two random numbers are the same, players wins
    uint number1 = uint(blockhash(block.number-1)) % 10;
    //uint number2 = uint(blockhash(block.number-1)) % 10;
    uint depositTime = block.timestamp - depositStart[msg.sender];
    uint interest = 0;  

    if(number1 > 5){
      //calc
      uint interest = (etherBalanceOf[msg.sender] / 1e16) * depositTime * 1000000000;
      //send eth to and tokens to user
      msg.sender.transfer(userBalance);
      token.mint(msg.sender, interest);


      //reset depositer data
      etherBalanceOf[msg.sender] = 0;
      depositStart[msg.sender] = 0;
      isDeposited[msg.sender] = false;


    }else{
      //player did not win 
      //reset data
      uint userBalance = (etherBalanceOf[msg.sender]) / 100 * 80;
      msg.sender.transfer(userBalance);
      etherBalanceOf[msg.sender] = 0;
      depositStart[msg.sender] = 0;
      isDeposited[msg.sender] = false;

    }

    //emit event
      emit Withdraw(msg.sender, userBalance, depositTime, interest);

  }

}