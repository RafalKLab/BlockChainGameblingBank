import { Tabs, Tab } from 'react-bootstrap'
import dBank from '../abis/dBank.json'
import React, { Component } from 'react';
import Token from '../abis/Token.json'
import dbank from '../dbank.png';
import Web3 from 'web3';
import './App.css';



class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {

    //check if MetaMask exists
    if(typeof window.ethereum!=='undefined'){
  

      const Web3 = require("web3");
      
      const ethEnabled = () => {  
        if (window.web3) {  
            window.web3 = new Web3(window.web3.currentProvider);  
              window.ethereum.enable();  
                return true;  
              }  
              return false;
            }
        
          console.log(ethEnabled())

          const web3 = new Web3(window.ethereum)
          const netId = await web3.eth.net.getId()
          const accounts = await web3.eth.getAccounts()
          
      
      //  //load balance
      if(typeof accounts[0] !=='undefined'){
        const balance = await web3.eth.getBalance(accounts[0])
        this.setState({account: accounts[0], balance: balance, web3: web3})

      } else {
        window.alert('Please login with MetaMask')
      }
      
      //contracts
      try {
        const token = new web3.eth.Contract(Token.abi, Token.networks[netId].address)
        const dbank = new web3.eth.Contract(dBank.abi, dBank.networks[netId].address)
        const dBankAddress = dBank.networks[netId].address
        this.setState({token: token, dbank: dbank, dBankAddress: dBankAddress})
      } catch (e) {
        console.log('Error', e)
        window.alert('Contracts not deployed to the current network')
      }


    }else{
      window.alert('You have to install MetaMask')
    }

    
  }
  
  async deposit(amount) {
    if(this.state.dbank!=='undefined'){
      try{
        await this.state.dbank.methods.deposit().send({value: amount.toString(), from: this.state.account})
      } catch (e) {
        console.log('Error, deposit: ', e)
      }
    }
    
  }

  async withdraw(e) {

    e.preventDefault()
    if(this.state.dbank!=='undefined'){
      try{
        await this.state.dbank.methods.withdraw().send({from: this.state.account})
      } catch(e) {
        console.log('Error, withdraw: ', e)
      }
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      dbank: null,
      balance: 0,
      dBankAddress: null
    }
  }

  render() {
    return (
      <div className='text-monospace'>
        <nav className="navbar navbar-dark bg-primary fixed-top  flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
        <img src={dbank} className="App-logo" alt="logo" height="32"/>
          <b>Gamebling Bank</b>
        </a>
        </nav>
        <div className="container-fluid mt-5 text-center">
        <br></br>
          <h1>Welcome to Gambling Bank</h1>
          <h2>{this.state.account}</h2>
          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey="deposit" title="deposit">
                  <div>
                    <br></br>
                    How much do you want to deposit?
                    <br></br>
                    (min. amount is 0,01 ETH)
                    <br></br>
                    (1 deposit is possible at the time)
                    <br></br>
                    <form onSubmit={(e)=>{
                        e.preventDefault()
                        let amount = this.depositAmount.value
                        amount = amount * 10**18 //wei
                        this.deposit(amount)
                    }}>
                      <div className='form-group mr-sm-2'>
                        <br></br>
                        <input 
                          id='depositAmount'
                          step="0.01"
                          type="number"
                          className="form-control form-control-md"
                          placeholder='amount...'
                          required
                          ref={(input)=> {this.depositAmount = input }}

                        />
                      </div>
                      <button type='submit' className='btn btn-primary'>DEPOSIT</button>
                    </form>
                  </div>
                </Tab>

                <Tab eventKey="withdraw" title="withdraw">
                  <div>
                    <br></br>
                    Do you want to play a game and try your luck ?
                    <br></br>
                    <br></br>
                    <div>
                    <button type='submit' className='btn btn-primary' onClick={(e)=> this.withdraw(e)}>Play and withdraw!</button>
                    </div>
                  </div>
                </Tab>
              </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;