import Web3 from 'web3';
import baseJSON from '../../build/contracts/ContratoSAS.json';
import { default as contract } from 'truffle-contract';

export default {
  init() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      //
      // This will not be used on the server
      // COMBAK: does web3 hold anything????
      //
      console.warn(
        "Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask",
      );
      // Use Mist/MetaMask's provider
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.warn(
        "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask",
      );
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      // window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
      window.web3 = new Web3(new Web3.providers.HttpProvider('/testrpc'));
    }

    // Setear el account default
    window.web3.eth.defaultAccount = window.web3.eth.accounts[0];

    // Desbloquear el account default
    window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '');

    const ContratoSAS = contract({ abi: baseJSON.abi, unlinked_binary: baseJSON.bytecode });

    ContratoSAS.setProvider(window.web3.currentProvider);

    console.log(ContratoSAS.new({ from: window.web3.eth.defaultAccount }));

    // console.log(ContratoSAS.deployed());

    // ContratoSAS.new({}).then(
    //   res => {
    //     console.log(res);
    //   },
    //   error => {
    //     console.log(ContratoSAS.deployed());
    //     // console.log(Object.keys(error);
    //   },
    // );

    // ContratoSAS.deployed().then(() => {
    //   console.log('aca');
    // });

    //
    // // Obtener JSON
    // const contratoJSON = baseJSON;
    //
    // // Obtener abi
    // const abi = contratoJSON.abi;
    //
    // // Obtener bytecode
    // const bytecode = contratoJSON.bytecode;
    //
    // // Crear proxy
    // const proxy = window.web3.eth.contract(abi);
    //
    // // A partir de acá usar proxy.at('<address>') para acceder a contratos ya deployados
    //
    // return proxy;
  },
};
