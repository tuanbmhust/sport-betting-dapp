import React, { Component } from 'react';
import getWeb3 from './utils/getWeb3.js';
import BettingContract from './contracts/BetApp.json';
import './App.css';

class TeamA extends Component {
    constructor() {
        super();
        this.state = {
            web3: '',
            Amount: '',
            InputAmount: '',
            weiConversion: 1000000000000000000
        }
        this.getAmount = this.getAmount.bind(this);
        this.Bet = this.Bet.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        getWeb3.then(results => {
            //Save information
            results.web3.eth.getAccounts((error, acc) => {
                this.setState({
                    web3: results.web3
                })
            });

            //Return the loaded web3
            return results.web3

        }).then(results => {
            //Pass web3 (in results) to the getAmount function
            this.getAmount(results)
        }).catch(() => {
            console.log('Error finding web3.')
        })
    }

    getAmount(web3) {
        //Get the contract
        const contract = require('@truffle/contract');
        const Betting = contract(BettingContract);
        Betting.setProvider(web3.currentProvider);
        var BettingInstance;
        web3.eth.getAccounts((error, accounts) => {
            Betting.deployed().then((instance) => {
                //Instantiate the contract in a promise
                BettingInstance = instance
            }).then((result) => {
                return BettingInstance.teamOneAmount.call({ from: accounts[0] })
            }).then((result) => {
                //Divided by 1e18 to convert in ether.
                this.setState({
                    Amount: result / 1000000000000000000
                })
            });
        })
    }

    Bet() {
        const contract = require('@truffle/contract');
        const Betting = contract(BettingContract);
        Betting.setProvider(this.state.web3.currentProvider);
        var BettingInstance;
        this.state.web3.eth.getAccounts((error, accounts) => {
            Betting.deployed().then((instance) => {
                BettingInstance = instance
            }).then((result) => {
                // Get the value from the contract to prove it worked
                return BettingInstance.bet(1, {
                    from: accounts[0],
                    value: this.state.InputAmount
                })
            }).catch(() => {
                console.log("Error with betting")
            })
        })
    }

    handleInputChange(e) {
        this.setState({ InputAmount: e.target.value * this.state.weiConversion });
    }

    render() {
        return (
            <div>
                <h3>Team A</h3>
                <h4> Total amount : {this.state.Amount} ETH</h4>
                <hr />
                <h5> Enter an amount to bet</h5>
                <div className="input-group">
                    <input type="text" className="form-control" onChange={this.handleInputChange} required pattern="[0-9]*[.,][0-9]*" />
                    <span className="input-group-addon">ETH</span>
                </div>
                <br />
                <button onClick={this.Bet}>Bet</button>
                <br />
                <hr />
            </div>
        )
    }

}
export default TeamA;

