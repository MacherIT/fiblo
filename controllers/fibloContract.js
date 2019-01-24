const fs = require('fs');
const { init } = require('../modules/fiblo/index');
const { exec } = require('child_process');
const contract = require('truffle-contract');

module.exports = {
  create: (proyecto, wallet_address, callback) => {
    const w3 = init();

    exec(`cd ${process.cwd()}`, (err, stdout, stderr) => {
      if (err) return;
      exec(`truffle migrate`, (err, stdout, stderr) => {
        if (err) return;

        w3.eth.defaultAccount = wallet_address;
        w3.personal.unlockAccount(w3.eth.defaultAccount, '');

        const contratoJSON = JSON.parse(fs.readFileSync('./build/contracts/ContratoSAS.json'));

        var ContratoSAS = contract(contratoJSON);

        ContratoSAS.setProvider(w3.currentProvider);

        ContratoSAS.deployed().then(instance => {
          console.log(instance.address);
          instance.setBeneficiario(w3.eth.defaultAccount, { from: w3.eth.defaultAccount });
          instance.setUrl(`http://localhost:8080/proyectos/${proyecto.id}`, {
            from: w3.eth.defaultAccount,
          });
          instance.setNombre(proyecto.nombre, { from: w3.eth.defaultAccount });
          instance.setMonto(proyecto.monto, { from: w3.eth.defaultAccount });
          instance.setMontoMax(proyecto.montoSuperaMax, { from: w3.eth.defaultAccount });
          // instance.setFecha(proyecto.createdAt); [TBM --> Fecha como string]

          callback(instance.address);
        });
      });
    });
  },
};
