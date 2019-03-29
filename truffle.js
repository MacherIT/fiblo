// Allows us to use ES6 in our migrations and tests.
require('babel-register');
const HDWalletProvider = require('truffle-hdwallet-provider');

const MNEMONIC =
  'filter yard prison quality subject engage exhibit zebra divert picnic spread crystal';

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '5777', // Match any network id
    },
    gethNet: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '10', // Match any network id
      gas: 1000000,
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          MNEMONIC,
          'https://ropsten.infura.io/v3/2785eeb549b4448da58df462da23aff1',
        );
      },
      network_id: 3,
      gas: 4000000, //make sure this gas allocation isn't over 4M, which is the max
    },
  },
};
