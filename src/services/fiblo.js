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
  receiveFunds(project_address, userId, monto, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '', () => {
          const proxySAS = window.web3.eth.contract(baseJSON.abi);
          const proyecto = proxySAS.at(project_address);

          proyecto.receiveFunds(
            userId,
            {
              value: window.web3.toWei(parseFloat(monto), 'ether'),
            },
            (error, tx) => {
              if (error) {
                callback(error, null);
              } else {
                callback(null, tx);
              }
            },
          );
        });
      }
    });
  },
  projectValiditySet(project_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '', () => {
          const proxySAS = window.web3.eth.contract(baseJSON.abi);
          const proyecto = proxySAS.at(project_address);
          proyecto.m_project_valid((err, res) => {
            if (err) {
              callback(err, null);
            }
            callback(null, res);
          });
        });
      }
    });
  },
  beneficiaryValiditySet(project_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '', () => {
          const proxySAS = window.web3.eth.contract(baseJSON.abi);
          const proyecto = proxySAS.at(project_address);
          proyecto.m_beneficiary_valid((err, res) => {
            if (err) {
              callback(err, null);
            }
            callback(null, res);
          });
        });
      }
    });
  },
  getMontoRecaudado(project_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '', () => {
          const proxySAS = window.web3.eth.contract(baseJSON.abi);
          const proyecto = proxySAS.at(project_address);
          const proxyCNV = window.web3.eth.contract(baseJSONCNV.abi);
          const cnv = proxyCNV.at(CNV_ADDRESS);
          cnv
            .beneficiaryAdded(
              {},
              {
                fromBlock: 0,
                toBlock: 'latest',
              },
            )
            .watch((error, event) => {
              if (error) {
                // callback(error, null);
              }
              console.log(event.args);
            });
          window.web3.eth.getBalance(proyecto.address, (error, balance) => {
            if (error) {
              callback(error, null);
            }
            callback(null, window.web3.fromWei(balance).toNumber());
          });
        });
      }
    });
  },
  getContribuciones(project_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '', () => {
          const proxySAS = window.web3.eth.contract(baseJSON.abi);
          const proyecto = proxySAS.at(project_address);

          proyecto
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
      }
    });
  },
  deployProyecto(proyecto, beneficiary_address, callback) {
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
              instance.setCNVAddress(CNV_ADDRESS, (err, res) => {
                if (err) {
                  callback(err, null);
                } else {
                  instance.setBeneficiario(beneficiary_address, (err, res) => {
                    if (err) {
                      callback(err, null);
                    } else {
                      callback(null, instance);
                    }
                  });
                }
              });
            }
          });
        });
      }
    });
  },
  setProjectValidity(project_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '', () => {
          const proxySAS = window.web3.eth.contract(baseJSON.abi);
          const proyecto = proxySAS.at(project_address);

          proyecto.setProjectValidity((error, res) => {
            console.log(res);
          });
        });
      }
    });
  },
  setBeneficiaryValidity(project_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '', () => {
          const proxySAS = window.web3.eth.contract(baseJSON.abi);
          const proyecto = proxySAS.at(project_address);

          proyecto.setBeneficiaryValidity((error, res) => {
            console.log(res);
          });
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
              callback(null, event);
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
  isBeneficiaryValid(beneficiary_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        const proxyCNV = window.web3.eth.contract(baseJSONCNV.abi);
        const cnv = proxyCNV.at(CNV_ADDRESS);
        cnv.isBeneficiaryValid(beneficiary_address, (error, res) => {
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
  addBeneficiary(beneficiary_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '', () => {
          const proxyCNV = window.web3.eth.contract(baseJSONCNV.abi);
          const cnv = proxyCNV.at(CNV_ADDRESS);
          cnv.addBeneficiary(beneficiary_address, (error, res) => {
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
  removeBeneficiary(beneficiary_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '', () => {
          const proxyCNV = window.web3.eth.contract(baseJSONCNV.abi);
          const cnv = proxyCNV.at(CNV_ADDRESS);
          cnv.removeBeneficiary(beneficiary_address, (error, res) => {
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
