// Allows us to use ES6 in our migrations and tests.
require('babel-register');
const HDWalletProvider = require('truffle-hdwallet-provider');

const MNEMONIC =
  'filter yard prison quality subject engage exhibit zebra divert picnic spread crystal';

const RSKMNEMONIC = 'battle room approve cube scrap version wheat same divide name banner toy';

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
    rsk: {
      provider: function() {
        return new HDWalletProvider(
          // RSKMNEMONIC,
          MNEMONIC,
          'https://public-node.testnet.rsk.co:443',
        );
      },
      network_id: '*',
      gas: 2500000,
      gasPrice: 183000,
    },
    rsklocal: {
      host: '127.0.0.1',
      port: 4444,
      network_id: '33', // Match any network id
      gas: 6800000,
      from: '0x81bedcc7314baf7606b665909cecdb4c68b180d6',
    },
  },
};
