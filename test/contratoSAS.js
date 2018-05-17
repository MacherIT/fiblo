var ContratoSAS = artifacts.require("./ContratoSAS.sol");

contract("ContratoSAS", function(accounts) {
  it("should take and file a contribution of 1 ETH from user 1", function() {
    var contractInstance;
    var succeded;
    var amountToSend = web3.toWei(1, "ether");
    var balanceBeforeSend;
    var balanceAfterSend;

    return ContratoSAS.deployed()
      .then(function(instance) {
        contractInstance = instance;
        balanceBeforeSend = web3.eth.getBalance(instance.address).toNumber();
        return contractInstance.sendTransaction({
          address: contractInstance.address,
          from: accounts[1],
          value: amountToSend
        });
      })
      .then(function() {
        return web3.eth.getBalance(contractInstance.address).toNumber();
      })
      .then(function(balance) {
        balanceAfterSend = balance;
        assert.equal(
          balanceBeforeSend + amountToSend,
          balanceAfterSend,
          "Balance is now 1 ether less than before"
        );
      });
  });
});
