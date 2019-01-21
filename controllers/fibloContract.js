const fs = require('fs');
const { init } = require('../modules/fiblo/index');

module.exports = {
  create: (proyecto, callback) => {
    // Abrir socket
    const w3 = init();

    w3.eth.defaultAccount = w3.eth.accounts[0];
    w3.personal.unlockAccount(w3.eth.defaultAccount, '');

    // Obtener JSON
    const contratoJSON = JSON.parse(fs.readFileSync('./build/contracts/ContratoSAS.json'));

    // Obtener abi
    const abi = contratoJSON.abi;

    // Obtener bytecode
    const bytecode = contratoJSON.bytecode;

    // Crear proxy
    const proxy = w3.eth.contract(abi);

    // Instanciar contrato (migrar)
    proxy.new({ from: w3.eth.defaultAccount, gas: 8000000, data: bytecode }, (err, instance) => {
      if (err) {
        console.log(err);
      } else {
        if (!instance.address) {
          console.log(instance.transactionHash); // The hash of the transaction, which deploys the contract
        } else {
          finish(instance.address);
        }
      }
    });

    const finish = address => {
      const contract = proxy.at(address);

      contract.setBeneficiario(w3.eth.defaultAccount); // Solo en este caso [TBM]
      contract.setUrl(`http://localhost:8080/proyectos/${proyecto.id}`);
      contract.setNombre(proyecto.nombre);
      contract.setMonto(proyecto.monto);
      contract.setMontoMax(proyecto.montoSuperaMax);
      // contract.setFecha(proyecto.createdAt); [TBM --> Fecha como string]

      callback(contract.address);
    };
  },
};
