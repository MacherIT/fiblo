var ContratoSAS = artifacts.require("./ContratoSAS.sol");
var CNV = artifacts.require("./CNV.sol");

module.exports = function(deployer) {
  deployer.deploy(ContratoSAS);
  deployer.deploy(CNV);
};
