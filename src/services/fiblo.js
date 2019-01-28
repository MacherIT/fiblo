import Web3 from 'web3';
import baseJSON from '../../build/contracts/ContratoSAS.json';
import { default as contract } from 'truffle-contract';

let ContratoSAS;

const web3Init = () => {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof window.web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
  }
  ContratoSAS = contract(baseJSON);
  ContratoSAS.setProvider(window.web3.currentProvider);
};

export default {
  getDefaultAccount(callback) {
    web3Init();
    window.web3.eth.getAccounts((error, accounts) => {
      if (error) {
        callback(error, null);
      }
      callback(null, accounts[0]);
    });
  },
  receiveFunds(userId, wallet_address, monto, callback) {
    web3Init();
    // window.web3.eth.getAccounts((error, accounts) => {
    //   if (error) {
    //     callback(error, null);
    //   }
    //   const account = accounts[1];
    ContratoSAS.deployed().then(instance => {
      instance
        .receiveFunds(userId, {
          value: window.web3.toWei(parseFloat(monto), 'ether'),
          from: wallet_address,
          address: instance.address,
          gas: 6721975,
        })
        .then(
          tx => {
            callback(null, tx);
          },
          error => {
            callback(error, null);
          },
        );
      // });
    });
  },
  getMontoRecaudado(callback) {
    web3Init();
    ContratoSAS.deployed().then(instance => {
      window.web3.eth.getBalance(instance.address, (error, balance) => {
        if (error) {
          callback(error, null);
        }
        callback(null, window.web3.fromWei(balance).toNumber());
      });
    });
  },
  getContribuciones(callback) {
    web3Init();
    ContratoSAS.deployed().then(instance => {
      instance
        .contributionFiled(
          {},
          {
            fromBlock: 0,
            toBlock: 'latest',
          },
        )
        .watch((error, event) => {
          if (error) {
            callback(error, null);
          }
          callback(null, event);

        });
    });
  },
};
