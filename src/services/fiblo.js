import Web3 from 'web3';
import baseJSON from '../../build/contracts/ContratoSAS.json';
import baseJSONCNV from '../../build/contracts/CNV.json';
import { default as contract } from 'truffle-contract';

const CNV_ADDRESS = '0x7522C726300e1911Bcf8908f68Ef52aC4750E84B';

let ContratoSAS;

const web3Init = callback => {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof window.web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
  }
  // ContratoSAS = contract(baseJSON);
  // ContratoSAS.setProvider(window.web3.currentProvider);
  window.web3.eth.getAccounts((error, accounts) => {
    if (error) {
      callback(error, null);
    }
    callback(null, accounts);
  });
};

export default {
  getDefaultAccount(callback) {
    web3Init();
    window.web3.eth.getAccounts((error, accounts) => {
      if (error) {
        callback(error, null);
      }
      callback(null, accounts[0]);
    });
  },
  receiveFunds(userId, wallet_address, monto, callback) {
    web3Init();
    // window.web3.eth.getAccounts((error, accounts) => {
    //   if (error) {
    //     callback(error, null);
    //   }
    //   const account = accounts[1];
    ContratoSAS.deployed().then(instance => {
      instance
        .receiveFunds(userId, {
          value: window.web3.toWei(parseFloat(monto), 'ether'),
          from: wallet_address,
          address: instance.address,
          gas: 6721975,
        })
        .then(
          tx => {
            callback(null, tx);
          },
          error => {
            callback(error, null);
          },
        );
      // });
    });
  },
  getMontoRecaudado(callback) {
    web3Init();
    ContratoSAS.deployed().then(instance => {
      window.web3.eth.getBalance(instance.address, (error, balance) => {
        if (error) {
          callback(error, null);
        }
        callback(null, window.web3.fromWei(balance).toNumber());
      });
    });
  },
  getContribuciones(callback) {
    web3Init();
    ContratoSAS.deployed().then(instance => {
      instance
        .contributionFiled(
          {},
          {
            fromBlock: 0,
            toBlock: 'latest',
          },
        )
        .watch((error, event) => {
          if (error) {
            callback(error, null);
          }
          callback(null, event);
        });
    });
  },
  deployProyecto(proyecto, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '', () => {
          const proxy = window.web3.eth.contract(baseJSON.abi);
          proxy.new({ data: baseJSON.bytecode }, (err, instance) => {
            if (err) {
              callback(err, null);
            }
            if (instance.address) {
              callback(null, instance);
            }
          });
        });
      }
    });
  },
  isContratoValid(project_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '', () => {
          const proxySAS = window.web3.eth.contract(baseJSON.abi);
          const proyecto = proxySAS.at(project_address);

          // proyecto.m_project_valid((error, res) => {
          //   console.log(res);
          // });

          // proyecto.setCNVAddress(CNV_ADDRESS, (error, res) => {
          //   console.log(res);
          // });

          proyecto.setProjectValidity((error, res) => {
            console.log(res);
          });
        });
      }
    });
  },
  isProjectValid(project_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        const proxyCNV = window.web3.eth.contract(baseJSONCNV.abi);
        const cnv = proxyCNV.at(CNV_ADDRESS);
        cnv.isProjectValid(project_address, (error, res) => {
          if (error) {
            callback(error, null);
          } else {
            console.log(res);
            callback(null, res);
          }
        });
      }
    });
  },
  isProjectValidWatch(callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '', () => {
          const proxyCNV = window.web3.eth.contract(baseJSONCNV.abi);
          const cnv = proxyCNV.at(CNV_ADDRESS);
          cnv
            .projectAdded(
              {},
              {
                fromBlock: 0,
                toBlock: 'latest',
              },
            )
            .watch((error, event) => {
              if (error) {
                callback(error, null);
              }
              console.log(`${event.args.project} added`);
              // console.log(event);
              callback(null, event);
            });
        });
      }
    });
  },
  isProjectInvalidWatch(callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '', () => {
          const proxyCNV = window.web3.eth.contract(baseJSONCNV.abi);
          const cnv = proxyCNV.at(CNV_ADDRESS);
          cnv
            .projectRemoved(
              {},
              {
                fromBlock: 0,
                toBlock: 'latest',
              },
            )
            .watch((error, event) => {
              if (error) {
                callback(error, null);
              }
              console.log(`${event.args.project} removed`);
              // console.log(event);
              callback(null, event);
            });
        });
      }
    });
  },
  addProject(project_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '', () => {
          const proxyCNV = window.web3.eth.contract(baseJSONCNV.abi);
          const cnv = proxyCNV.at(CNV_ADDRESS);
          cnv.addProject(project_address, (error, res) => {
            if (error) {
              callback(error, null);
            } else {
              callback(null, res);
            }
          });
        });
      }
    });
  },
  removeProject(project_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '', () => {
          const proxyCNV = window.web3.eth.contract(baseJSONCNV.abi);
          const cnv = proxyCNV.at(CNV_ADDRESS);
          cnv.removeProject(project_address, (error, res) => {
            if (error) {
              callback(error, null);
            } else {
              callback(null, res);
            }
          });
        });
      }
    });
  },
};
