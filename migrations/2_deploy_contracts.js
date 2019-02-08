// var ContratoSAS = artifacts.require("./ContratoSAS.sol");
var CNV = artifacts.require('./CNV.sol');
// var SASFactory = artifacts.require('./SASFactory.sol');

module.exports = function(deployer) {
  // deployer.deploy(ContratoSAS);
  deployer.deploy(CNV);
  // deployer.deploy(SASFactory);
};
