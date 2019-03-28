// var ContratoSAS = artifacts.require("./ContratoSAS.sol");
var CNV = artifacts.require('./CNV.sol');
var OraculoPrecio = artifacts.require('./OraculoPrecio.sol');
// var StandAlone = artifacts.require('./StandAlone.sol');
// var Module = artifacts.require('./Module.sol');
// var SASFactory = artifacts.require('./SASFactory.sol');

module.exports = function(deployer) {
  // deployer.deploy(ContratoSAS);
  deployer.deploy(CNV);
  deployer.deploy(OraculoPrecio);
  // deployer.deploy(SASFactory);
  // const x = deployer.deploy(StandAlone);
  // x.then(instance => {
  // console.log(instance.address);
  // console.log(StandAlone.address);
  // deployer.deploy(Module);
  // });
};
