require('dotenv').config();

const HDWalletProvider = require("@truffle/hdwallet-provider");
const infuraKey = process.env.INFURA_API_KEY;
const mnenomic = process.env.MNENOMIC;

module.exports = {
  networks: {
    development: {
      host: 'localhost',     // Localhost (default: none)
      port: 9545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    ropsten: {
      provider: () => new HDWalletProvider(mnenomic, "https://ropsten.infura.io/v3/" + infuraKey),
      network_id: 3,
      gas: 4600000,
      gasPrice: 10000000000
    }
  }
}
