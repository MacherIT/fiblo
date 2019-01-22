// cd a la carpeta del proyecto

// Incluir web3
const Web3 = require('web3');

// Instanciar con el nodo de ganache corriendo
w3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

// Setear el account default
w3.eth.defaultAccount = w3.eth.accounts[0];

// Desbloquear el account default
w3.personal.unlockAccount(w3.eth.defaultAccount, '');

// Obtener JSON
const contratoJSON = JSON.parse(fs.readFileSync('./build/contracts/ContratoSAS.json'));

// Obtener abi
const abi = contratoJSON.abi;

// Obtener bytecode
const bytecode = contratoJSON.bytecode;

// Crear proxy
const proxy = w3.eth.contract(abi);

// A partir de acá usar proxy.at('<address>') para acceder a contratos ya deployados
