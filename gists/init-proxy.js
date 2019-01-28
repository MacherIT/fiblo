// cd a la carpeta del proyecto

// Incluir web3
const Web3 = require('web3');

// Instanciar con el nodo de ganache corriendo
web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

// Setear el account default
web3.eth.defaultAccount = web3.eth.accounts[0];

// Desbloquear el account default
web3.personal.unlockAccount(web3.eth.defaultAccount, '');

// Obtener JSON
const contratoJSON = JSON.parse(fs.readFileSync('./build/contracts/ContratoSAS.json'));

// Obtener abi
const abi = contratoJSON.abi;

// Obtener bytecode
const bytecode = contratoJSON.bytecode;

// Crear proxy
const proxy = web3.eth.contract(abi);

// A partir de acá usar proxy.at('<address>') para acceder a contratos ya deployados
