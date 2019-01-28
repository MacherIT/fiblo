// cd a la carpeta del proyecto

// Incluir web3
const Web3 = require('web3');

// Instanciar con el nodo de ganache corriendo
web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

// window.web3 = new Web3(window.web3.currentProvider);

// Setear el account default
web3.eth.defaultAccount = web3.eth.accounts[0];

// Desbloquear el account default
web3.personal.unlockAccount(web3.eth.defaultAccount, '');

// web3.personal.unlockAccount(web3.eth.defaultAccount, '', () => {});

// Obtener JSON
const contratoJSON = JSON.parse(fs.readFileSync('./build/contracts/ContratoSAS.json'));

// Obtener abi
const abi = contratoJSON.abi;

// Obtener bytecode
const bytecode = contratoJSON.bytecode;

// Crear proxy
const proxy = web3.eth.contract(abi);

// A partir de acá usar proxy.at('<address>') para acceder a contratos ya deployados

// gas = ''

// web3.eth.estimateGas({data:bytecode}, (error, res) => {gas = res})

// VERSIÓN OFICIAL
// var contractInstance = proxy.new([constructorParam1] [, constructorParam2], {data: '0x12345...', from: myAccount, gas: 1000000});

// instance = ''

// proxy.new({data: bytecode}, (err, res) => {instance = res})
