import Web3 from 'web3';
// import baseJSONFactory from '../../build/contracts/SASFactory.json';
import baseJSON from '../../build/contracts/ContratoSAS.json';
import baseJSONCNV from '../../build/contracts/CNV.json';
import baseJSONOraculoPrecio from '../../build/contracts/OraculoPrecio.json';
import { default as contract } from 'truffle-contract';

const CNV_ADDRESS = baseJSONCNV.networks['5777'].address;
const ORACULO_PRECIO_ADDRESS = baseJSONOraculoPrecio.networks['5777'].address;
// const FACTORY_ADDRESS = baseJSONFactory.networks['5777'].address;

const web3Init = callback => {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof window.web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
  }

  // DEV ONLY
  // DEV ONLY
  // DEV ONLY

  const proxySAS = window.web3.eth.contract(baseJSON.abi);
  window.initProyecto = project_address => {
    window.proyecto = proxySAS.at(project_address);
  };

  const oraculoProxy = window.web3.eth.contract(baseJSONOraculoPrecio.abi);
  window.oraculo = oraculoProxy.at(ORACULO_PRECIO_ADDRESS);

  // DEV ONLY
  // DEV ONLY
  // DEV ONLY

  window.web3.eth.getAccounts((error, accounts) => {
    if (error) {
      callback(error, null);
    }
    callback(null, accounts);
  });
};

export default {
  getDefaultAccount(callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '', () => {
          callback(null, accounts[0]);
        });
      }
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
          console.log(monto);

          proyecto.receiveFunds(
            userId,
            {
              gasLimit: 6721975,
              gasPrice: 2000000,
              from: window.web3.eth.defaultAccount,
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
          proyecto.m_project_valid((error, res) => {
            if (error) {
              callback(error, null);
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
          proyecto.m_beneficiary_valid((error, res) => {
            if (error) {
              callback(error, null);
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
          // const proxyCNV = window.web3.eth.contract(baseJSONCNV.abi);
          // const cnv = proxyCNV.at(CNV_ADDRESS);
          // cnv
          //   .beneficiaryAdded(
          //     {},
          //     {
          //       fromBlock: 0,
          //       toBlock: 'latest',
          //     },
          //   )
          //   .watch((error, event) => {
          //     if (error) {
          //       // callback(error, null);
          //     }
          //     console.log(event.args);
          //   });
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
  getContribucionesGET(project_address, callback) {
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
            .get((error, events) => {
              if (error) {
                callback(error, null);
              }
              callback(null, events);
            });
        });
      }
    });
  },
  getFechaCierre(project_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '', () => {
          const proxySAS = window.web3.eth.contract(baseJSON.abi);
          const proyecto = proxySAS.at(project_address);
          proyecto.m_fecha_cierre((error, fechaCierre) => {
            if (error) {
              callback(error, null);
            }
            callback(null, fechaCierre);
          });
        });
      }
    });
  },
  getFundsReturned(project_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '', () => {
          const proxySAS = window.web3.eth.contract(baseJSON.abi);
          const proyecto = proxySAS.at(project_address);
          proyecto
            .fundReturned(
              {},
              {
                fromBlock: 0,
                toBlock: 'latest',
              },
            )
            .get((error, event) => {
              if (error) {
                callback(error, null);
              }
              callback(null, event);
            });
        });
      }
    });
  },
  deployProyectoFull(
    beneficiary_address,
    cant_acciones,
    symbol,
    monto,
    monto_max,
    fecha,
    callback,
  ) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '', () => {
          const proxy = window.web3.eth.contract(baseJSON.abi);
          proxy.new(
            CNV_ADDRESS,
            ORACULO_PRECIO_ADDRESS,
            beneficiary_address,
            cant_acciones,
            symbol,
            monto,
            monto_max,
            fecha,
            {
              data: baseJSON.bytecode,
            },
            (error, instance) => {
              if (error) {
                callback(error, null);
              }
              callback(null, instance);
            },
          );
        });
      }
    });
  },
  deployProyecto(proyecto, beneficiary_address, cant_acciones, symbol, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '', () => {
          // const sasFactoryProxy = window.web3.eth.contract(baseJSONFactory.abi);
          // const proxySAS = window.web3.eth.contract(baseJSON.abi);
          // const sasFactory = sasFactoryProxy.at(FACTORY_ADDRESS);
          //
          // sasFactory.createContrato((error, address) => {
          //   if (error) {
          //     callback(error, null);
          //   }
          //   if (address) {
          //     const proyecto = proxySAS.at(address);
          //     console.log(proyecto);
          //     proyecto.setCNVAddress(CNV_ADDRESS, (error, res) => {
          //       if (error) {
          //         callback(error, null);
          //       } else {
          //         proyecto.setBeneficiario(beneficiary_address, (error, res) => {
          //           if (error) {
          //             callback(error, null);
          //           } else {
          //             callback(null, proyecto);
          //           }
          //         });
          //       }
          //     });
          //   }
          // });

          /* COMBAK:
          PARA PODER USAR UN FACTORY, HAY QUE REVISAR EL MODELO DE 'ONLYOWNER',
          POR ENDE, POR AHORA, LO DEJO COMO ESTABA
          */

          const proxy = window.web3.eth.contract(baseJSON.abi);
          proxy.new({ data: baseJSON.bytecode }, (error, instance) => {
            if (error) {
              callback(error, null);
            }
            if (instance.address) {
              instance.setCNVAddress(CNV_ADDRESS, (error, res) => {
                if (error) {
                  callback(error, null);
                } else {
                  instance.setBeneficiario(beneficiary_address, (error, res) => {
                    if (error) {
                      callback(error, null);
                    } else {
                      instance.setCantAcciones(cant_acciones, (error, res) => {
                        if (error) {
                          callback(error, null);
                        } else {
                          instance.setSymbol(symbol, (error, res) => {
                            if (error) {
                              callback(error, null);
                            } else {
                              callback(null, instance);
                            }
                          });
                        }
                      });
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
            if (error) {
              callback(error, null);
            }
            callback(null, res);
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
            if (error) {
              callback(error, null);
            }
            callback(null, res);
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
  balanceOf(project_address, account_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '', () => {
          const proxySAS = window.web3.eth.contract(baseJSON.abi);
          const proyecto = proxySAS.at(project_address);
          proyecto.balanceOf(account_address, (error, res) => {
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
  transfer(project_address, to_address, cant_tokens, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '', () => {
          const proxySAS = window.web3.eth.contract(baseJSON.abi);
          const proyecto = proxySAS.at(project_address);
          proyecto.transfer(to_address, cant_tokens, (error, res) => {
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
  closeRound(project_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '', () => {
          const proxySAS = window.web3.eth.contract(baseJSON.abi);
          const proyecto = proxySAS.at(project_address);
          proyecto.closeRound((error, res) => {
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
  isProjectClosed(project_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(window.web3.eth.defaultAccount, '', () => {
          const proxySAS = window.web3.eth.contract(baseJSON.abi);
          const proyecto = proxySAS.at(project_address);
          proyecto.m_closed_round((error, res) => {
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
