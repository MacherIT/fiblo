// Import the page's CSS. Webpack will know what to do with it.
import '../stylesheets/app.css'

import 'bootstrap/dist/css/bootstrap.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import contrato_artifacts from '../../build/contracts/ContratoSAS.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var ContratoSAS = contract(contrato_artifacts)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts
var account

function convertPesosIntoEther (amountInPesos) {
  // TODO: Tomar el valor de alguna API
  // Se usa el valor $/ETH del 17/05/2018
  return amountInPesos / 16200
}

window.App = {

  start: function () {
    var self = this


    // Bootstrap the MetaCoin abstraction for Use.
    ContratoSAS.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accounts[0]

      App.basicInfoUpdate()
      App.listenToEvents()
    })
  },

  submitTransactionPesos: function () {
    var _amountInPesos = parseInt(document.getElementById('monto_pesos').value)
    var userId = parseInt(document.getElementById('user_id').value)

    ContratoSAS.deployed()
      .then(function (instance) {
        var amountInEther = convertPesosIntoEther(_amountInPesos)
        return instance.receiveFunds(userId, {
          value: web3.toWei(amountInEther, 'ether'),
          from: accounts[2],
          address: instance.address,
          gas: 500000
        })
      })
      .then(function (result) {
        console.log(result)
        App.basicInfoUpdate()
      })
      .catch(function (err) {
        console.error(err)
      })
  },

  submitTransactionEther: function () {
    var _amount = parseFloat(document.getElementById('monto_ether').value)
    var userId = parseInt(document.getElementById('user_id').value)

    ContratoSAS.deployed()
      .then(function (instance) {
        return instance.receiveFunds(userId, {
          value: web3.toWei(_amount, 'ether'),
          from: accounts[2],
          address: instance.address,
          gas: 500000
        })
      })
      .then(function (result) {
        console.log(result)
        App.basicInfoUpdate()
      })
      .catch(function (err) {
        console.error(err)
      })
  },

  basicInfoUpdate: function () {
    ContratoSAS.deployed().then(function (instance) {
      document.getElementById('walletAddress').innerHTML = instance.address
      document.getElementById('walletEther').innerHTML = web3.fromWei(
        web3.eth.getBalance(instance.address).toNumber(),
        'ether'
      )
    })
  },

  listenToEvents: function () {
    ContratoSAS.deployed().then(function (instance) {
      instance
        .receivedFunds(
          {},
        {
          fromBlock: 0,
          toBlock: 'latest'
        }
        )
        .watch(function (error, event) {
          document.getElementById('fundEvents').innerHTML += JSON.stringify(event)
        })
      instance
        .contributionFiled(
          {},
        {
          fromBlock: 0,
          toBlock: 'latest'
        }
        )
        .watch(function (error, event) {
          // Agrega en la lista de Contribuciones
          var contributions = document.createElement('LI')
          console.log(event)
          contributions.innerHTML =
            'Valor: ' +
            JSON.stringify(event.args.amount) +
            '</br> De: ' +
            JSON.stringify(event.args.from) +
            '</br> ID usuario: ' +
            JSON.stringify(event.args.uid)
          document.getElementById('contribEvents').append(contributions)

          // Agrega en lista de Socios Crowdfunders
          var socio = document.createElement('LI')
          // console.log(event);
          console.log(instance)
          socio.innerHTML =
            'ID usuario: ' + JSON.stringify(event.args.uid) + '</br> Valor: ' + JSON.stringify(event.args.amount)
          document.getElementById('socios_crowdfunders').append(socio)
        })
    })
  }
}

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      "Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask"
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask"
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
  }

  App.start()
})
