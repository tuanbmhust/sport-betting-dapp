import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import getWeb3 from './utils/getWeb3.js';
import { Container, Row, Col } from 'react-bootstrap';
import TeamA from './TeamA.jsx';
import TeamB from './TeamB.jsx';
import BettingContract from './contracts/BetApp.json';

class App extends Component {
  constructor() {
    super();
    this.state = {
      web3: '',
      address: '',
      winnerTeam: ''
    };

    this.getWinner = this.getWinner.bind(this);
  }
  componentDidMount() {
    getWeb3.then(results => {
      results.web3.eth.getAccounts((error, acc) => {
        //this.setState is used to edit the state variables
        this.setState({
          address: acc[0],
          web3: results.web3
        })

        console.log(this.state);
      });
    }).catch(() => {
      //No web3 provider was found
      console.log('Error finding web3.')
    })
  }

  getWinner() {
    const contract = require('@truffle/contract');
    const Betting = contract(BettingContract);
    Betting.setProvider(this.state.web3.currentProvider);
    var BettingInstance;
    this.state.web3.eth.getAccounts((error, accounts) => {
      Betting.deployed().then((instance) => {
        BettingInstance = instance
      }).then((result) => {
        this.winnerTeam = BettingInstance.distributePrize({ from: accounts[0] });
        console.log(this.winnerTeam);
        return this.winnerTeam;
      }).catch(() => {
        console.log("Error with distributing prizes")
      })
    })
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Bet-eth</h1>
        </header>
        <div>
          Welcome on my Ethereum Betting website <br />
        Your Wallet address is {this.state.address}
        </div>
        <Container>
          <Row>
            <Col xs={6} sm={6}><TeamA /></Col>
            <Col xs={6} sm={6}><TeamB /></Col>
          </Row>
          <Row xs={6} sm={6}>
            <button onClick={this.getWinner}>Winning team is: {this.state.winnerTeam}</button>
          </Row>
        </Container>
        <br />
      </div>
    );
  }
}

export default App;
