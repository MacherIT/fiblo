const fs = require('fs');
const { init } = require('../modules/fiblo/index');
const { exec } = require('child_process');
const contract = require('truffle-contract');

module.exports = {
  create: (proyecto, callback) => {
    // Abrir socket
    const w3 = init();

    console.log('****************************');

    console.log(process.cwd());

    exec(`cd ${process.cwd()}`, (err, stdout, stderr) => {
      if (err) return;
      exec(`truffle migrate`, (err, stdout, stderr) => {
        if (err) return;

        w3.eth.defaultAccount = w3.eth.accounts[0];
        w3.personal.unlockAccount(w3.eth.defaultAccount, '');

        const contratoJSON = JSON.parse(fs.readFileSync('./build/contracts/ContratoSAS.json'));

        var ContratoSAS = contract(contratoJSON);

        ContratoSAS.setProvider(w3.currentProvider);

        ContratoSAS.deployed().then(instance => {
          console.log('****************************');

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

    //     exec('cat *.js bad_file | wc -l', (err, stdout, stderr) => {
    //   if (err) {
    //     // node couldn't execute the command
    //     return;
    //   }
    //
    //   // the *entire* stdout and stderr (buffered)
    //   console.log(`stdout: ${stdout}`);
    //   console.log(`stderr: ${stderr}`);
    // });

    // w3.eth.defaultAccount = w3.eth.accounts[0];
    // w3.personal.unlockAccount(w3.eth.defaultAccount, '');
    //
    // // Obtener JSON
    //
    // // Obtener abi
    // const abi = contratoJSON.abi;
    //
    // // Obtener bytecode
    // const bytecode = contratoJSON.bytecode;
    //
    // // Crear proxy
    // const proxy = w3.eth.contract(abi);
    //
    // // Instanciar contrato (migrar)
    // proxy.new({ from: w3.eth.defaultAccount, gas: 8000000, data: bytecode }, (err, instance) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     if (!instance.address) {
    //       console.log(instance.transactionHash); // The hash of the transaction, which deploys the contract
    //     } else {
    //       finish(instance.address);
    //     }
    //   }
    // });
    //
    // const finish = address => {
    //   const contract = proxy.at(address);
    //
    //   contract.setBeneficiario(w3.eth.defaultAccount); // Solo en este caso [TBM]
    //   contract.setUrl(`http://localhost:8080/proyectos/${proyecto.id}`);
    //   contract.setNombre(proyecto.nombre);
    //   contract.setMonto(proyecto.monto);
    //   contract.setMontoMax(proyecto.montoSuperaMax);
    //   // contract.setFecha(proyecto.createdAt); [TBM --> Fecha como string]
    //
    //   callback(contract.address);
    // };
  },
};
