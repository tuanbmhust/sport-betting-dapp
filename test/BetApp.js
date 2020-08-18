const { assert } = require("console");

var BetApp = artifacts.require("BetApp");

contract('BetApp', (accounts) => {
    it("Should deploy contract properly", async () => {
        const betApp = await BetApp.deployed();
        console.log(betApp.address);
        assert(betApp.address !== '');
    })
})