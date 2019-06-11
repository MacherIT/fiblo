import Web3 from "web3";
import baseJSON from "../../build/contracts/ContratoSAS.json";
import baseJSONCNV from "../../build/contracts/CNV.json";
import baseJSONOraculoPrecio from "../../build/contracts/OraculoPrecio.json";

let CNV_ADDRESS;
let ORACULO_PRECIO_ADDRESS;
let NETWORK_VERSION;

// const MODULE_ADDRESS = MODULE.networks['3'].address;
// const SA_ADDRESS = SA.networks['3'].address;

// const FACTORY_ADDRESS = baseJSONFactory.networks['3'].address;

const web3Init = callback => {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof window.web3 !== "undefined") {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    window.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:7545")
    );
  }

  window.web3.version.getNetwork((error, networkVersion) => {
    if (error) {
      console.error(error);
    } else {
      NETWORK_VERSION = networkVersion;

      CNV_ADDRESS = baseJSONCNV.networks[networkVersion].address;
      ORACULO_PRECIO_ADDRESS =
        baseJSONOraculoPrecio.networks[networkVersion].address;

      const proxySAS = window.web3.eth.contract(baseJSON.abi);
      window.initProyecto = project_address => {
        window.proyecto = proxySAS.at(project_address);
      };

      const oraculoProxy = window.web3.eth.contract(baseJSONOraculoPrecio.abi);
      window.oraculo = oraculoProxy.at(ORACULO_PRECIO_ADDRESS);

      const cnvProxy = window.web3.eth.contract(baseJSONCNV.abi);
      window.cnv = cnvProxy.at(CNV_ADDRESS);

      window.web3.eth.getAccounts((error, accounts) => {
        if (error) {
          callback(error, null);
        }
        callback(null, accounts);
      });
    }
  });
};

const web3InitNoAccount = callback => {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof window.web3 !== "undefined") {
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(window.web3.currentProvider);
  } else {
    window.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:7545")
    );
  }

  window.web3.version.getNetwork((error, networkVersion) => {
    if (error) {
      callback(error, null);
    } else {
      NETWORK_VERSION = networkVersion;
      callback(null, networkVersion);
    }
  });
};

export default {
  getNetworkVersion(callback) {
    web3InitNoAccount((error, accounts) => {
      if (error) {
        callback(error, null);
      } else if (NETWORK_VERSION) {
        callback(null, NETWORK_VERSION);
      } else {
        callback(false, null);
      }
    });
  },
  isMetaMaskInstalled(callback) {
    web3Init((error, accounts) => {
      if (error) {
        callback(false);
      } else if (
        !window.web3 ||
        !window.web3.currentProvider ||
        !window.web3.currentProvider.isMetaMask ||
        !accounts ||
        !accounts[0]
      ) {
        callback(false);
      } else {
        callback(true);
      }
    });
  },
  getDefaultAccount(callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(
          window.web3.eth.defaultAccount,
          "",
          () => {
            callback(null, accounts[0]);
          }
        );
      }
    });
  },
  receiveFunds(project_address, userId, monto, callback) {
    let logIndexN = -1;
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(
          window.web3.eth.defaultAccount,
          "",
          () => {
            const proxySAS = window.web3.eth.contract(baseJSON.abi);
            const proyecto = proxySAS.at(project_address);
            console.log(monto);

            web3.eth.estimateGas(
              {
                data: baseJSON.bytecode,
                from: web3.eth.defaultAccount
              },
              (err, res) => {
                if (err) {
                  console.error(err);
                } else {
                  const gas = res;
                  web3.eth.getGasPrice((err, res) => {
                    if (err) {
                      console.error(err);
                    } else {
                      const gasPrice = res;

                      proyecto.receiveFunds(
                        parseInt(userId),
                        {
                          from: window.web3.eth.defaultAccount,
                          value: Math.floor(window.web3.toWei(monto, "ether")),
                          gas,
                          gasPrice
                        },
                        (error, instance) => {
                          console.log(
                            window.web3.eth.accounts[0],
                            window.web3.toWei(parseFloat(monto), "ether")
                          );
                          const filter = web3.eth.filter({
                            toBlock: "latest"
                          });
                          filter.watch((error, log) => {
                            if (
                              log.transactionHash &&
                              log.transactionHash ===
                                instance.transactionHash &&
                              logIndexN < 0
                            ) {
                              if (error) {
                                callback(error, null);
                              } else {
                                logIndexN = log.logIndex;
                                callback(null, instance);
                                filter.stopWatching();
                              }
                            }
                          });
                        }
                      );
                    }
                  });
                }
              }
            );
          }
        );
      }
    });
  },
  projectValiditySet(project_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(
          window.web3.eth.defaultAccount,
          "",
          () => {
            const proxySAS = window.web3.eth.contract(baseJSON.abi);
            const proyecto = proxySAS.at(project_address);
            proyecto.m_project_valid((error, res) => {
              if (error) {
                callback(error, null);
              }
              callback(null, res);
            });
          }
        );
      }
    });
  },
  beneficiaryValiditySet(project_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(
          window.web3.eth.defaultAccount,
          "",
          () => {
            const proxySAS = window.web3.eth.contract(baseJSON.abi);
            const proyecto = proxySAS.at(project_address);
            proyecto.m_beneficiary_valid((error, res) => {
              if (error) {
                callback(error, null);
              }
              callback(null, res);
            });
          }
        );
      }
    });
  },
  getMontoRecaudado(project_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(
          window.web3.eth.defaultAccount,
          "",
          () => {
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
          }
        );
      }
    });
  },
  getContribuciones(project_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(
          window.web3.eth.defaultAccount,
          "",
          () => {
            const proxySAS = window.web3.eth.contract(baseJSON.abi);
            const proyecto = proxySAS.at(project_address);
            proyecto
              .contributionFiled(
                {},
                {
                  fromBlock: 0,
                  toBlock: "latest"
                }
              )
              .watch((error, event) => {
                if (error) {
                  callback(error, null);
                }
                callback(null, event);
              });
          }
        );
      }
    });
  },
  getContribucionesGET(project_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(
          window.web3.eth.defaultAccount,
          "",
          () => {
            const proxySAS = window.web3.eth.contract(baseJSON.abi);
            const proyecto = proxySAS.at(project_address);
            proyecto
              .contributionFiled(
                {},
                {
                  fromBlock: 0,
                  toBlock: "latest"
                }
              )
              .get((error, events) => {
                if (error) {
                  callback(error, null);
                }
                callback(null, events);
              });
          }
        );
      }
    });
  },
  getFechaCierre(project_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(
          window.web3.eth.defaultAccount,
          "",
          () => {
            const proxySAS = window.web3.eth.contract(baseJSON.abi);
            const proyecto = proxySAS.at(project_address);
            proyecto.m_fecha_cierre((error, fechaCierre) => {
              if (error) {
                callback(error, null);
              }
              callback(null, fechaCierre);
            });
          }
        );
      }
    });
  },
  getFundsReturned(project_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(
          window.web3.eth.defaultAccount,
          "",
          () => {
            const proxySAS = window.web3.eth.contract(baseJSON.abi);
            const proyecto = proxySAS.at(project_address);
            proyecto
              .fundReturned(
                {},
                {
                  fromBlock: 0,
                  toBlock: "latest"
                }
              )
              .get((error, event) => {
                if (error) {
                  callback(error, null);
                }
                callback(null, event);
              });
          }
        );
      }
    });
  },
  deployProyectoFull(cant_acciones, symbol, monto, monto_max, fecha, callback) {
    let logIndexN = -1;
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(
          window.web3.eth.defaultAccount,
          "",
          () => {
            const proxy = window.web3.eth.contract(baseJSON.abi);
            web3.eth.estimateGas(
              {
                data: baseJSON.bytecode,
                from: web3.eth.defaultAccount
              },
              (err, res) => {
                if (err) {
                  console.error(err);
                } else {
                  const gas = res;
                  web3.eth.getGasPrice((err, res) => {
                    if (err) {
                      console.error(err);
                    } else {
                      const gasPrice = res;
                      proxy.new(
                        CNV_ADDRESS,
                        ORACULO_PRECIO_ADDRESS,
                        window.web3.eth.defaultAccount,
                        cant_acciones,
                        symbol,
                        monto,
                        monto_max,
                        fecha,
                        {
                          from: web3.eth.defaultAccount,
                          data: baseJSON.bytecode,
                          gas,
                          gasPrice
                        },
                        (error, instance) => {
                          const filter = web3.eth.filter({
                            toBlock: "latest"
                          });
                          filter.watch((error, log) => {
                            if (
                              // log &&
                              // log.transactionHash &&
                              // log.transactionHash ===
                              // instance.transactionHash &&
                              // logIndexN < 0
                              instance.address
                            ) {
                              // if (error) {
                              //   callback(error, null);
                              //   // } else if (log.address) {
                              // } else {
                              // console.log("aca");

                              // logIndexN = log.logIndex;
                              callback(null, {
                                ...instance
                                // address: log.address
                              });
                              filter.stopWatching();
                              // }
                            }
                          });
                        }
                      );
                    }
                  });
                }
              }
            );
          }
        );
      }
    });
  },
  deployProyecto(
    proyecto,
    beneficiary_address,
    cant_acciones,
    symbol,
    callback
  ) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(
          window.web3.eth.defaultAccount,
          "",
          () => {
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
                    instance.setBeneficiario(
                      beneficiary_address,
                      (error, res) => {
                        if (error) {
                          callback(error, null);
                        } else {
                          instance.setCantAcciones(
                            cant_acciones,
                            (error, res) => {
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
                            }
                          );
                        }
                      }
                    );
                  }
                });
              }
            });
          }
        );
      }
    });
  },
  setProjectValidity(project_address, callback) {
    let logIndexN = -1;
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(
          window.web3.eth.defaultAccount,
          "",
          () => {
            const proxySAS = window.web3.eth.contract(baseJSON.abi);
            const proyecto = proxySAS.at(project_address);

            web3.eth.estimateGas(
              {
                data: baseJSON.bytecode,
                from: web3.eth.defaultAccount
              },
              (err, res) => {
                if (err) {
                  console.error(err);
                } else {
                  const gas = res;
                  web3.eth.getGasPrice((err, res) => {
                    if (err) {
                      console.error(err);
                    } else {
                      const gasPrice = res;

                      proyecto.setProjectValidity(
                        { gas, gasPrice },
                        (error, instance) => {
                          const filter = web3.eth.filter({
                            toBlock: "latest"
                          });
                          filter.watch((error, log) => {
                            console.log(log.transactionHash);
                            if (
                              log.transactionHash &&
                              log.transactionHash === instance &&
                              logIndexN < 0
                            ) {
                              if (error) {
                                callback(error, null);
                              } else {
                                logIndexN = log.logIndex;
                                callback(null, instance);
                                filter.stopWatching();
                              }
                            }
                          });
                        }
                      );
                    }
                  });
                }
              }
            );
          }
        );
      }
    });
  },
  setBeneficiaryValidity(project_address, callback) {
    let logIndexN = -1;
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(
          window.web3.eth.defaultAccount,
          "",
          () => {
            const proxySAS = window.web3.eth.contract(baseJSON.abi);
            const proyecto = proxySAS.at(project_address);

            web3.eth.estimateGas(
              {
                data: baseJSON.bytecode,
                from: web3.eth.defaultAccount
              },
              (err, res) => {
                if (err) {
                  console.error(err);
                } else {
                  const gas = res;
                  web3.eth.getGasPrice((err, res) => {
                    if (err) {
                      console.error(err);
                    } else {
                      const gasPrice = res;

                      proyecto.setBeneficiaryValidity(
                        { gas, gasPrice },
                        (error, instance) => {
                          const filter = web3.eth.filter({
                            toBlock: "latest"
                          });
                          filter.watch((error, log) => {
                            if (
                              log.transactionHash &&
                              log.transactionHash ===
                                instance.transactionHash &&
                              logIndexN < 0
                            ) {
                              if (error) {
                                callback(error, null);
                              } else {
                                logIndexN = log.logIndex;
                                callback(null, instance);
                                filter.stopWatching();
                              }
                            }
                          });
                        }
                      );
                    }
                  });
                }
              }
            );
          }
        );
      }
    });
  },
  isProjectValidWatch(callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(
          window.web3.eth.defaultAccount,
          "",
          () => {
            const proxyCNV = window.web3.eth.contract(baseJSONCNV.abi);
            const cnv = proxyCNV.at(CNV_ADDRESS);
            cnv
              .projectAdded(
                {},
                {
                  fromBlock: 0,
                  toBlock: "latest"
                }
              )
              .watch((error, event) => {
                if (error) {
                  callback(error, null);
                }
                console.log(`${event.args.project} added`);
                callback(null, event);
              });
          }
        );
      }
    });
  },
  isProjectInvalidWatch(callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(
          window.web3.eth.defaultAccount,
          "",
          () => {
            const proxyCNV = window.web3.eth.contract(baseJSONCNV.abi);
            const cnv = proxyCNV.at(CNV_ADDRESS);
            cnv
              .projectRemoved(
                {},
                {
                  fromBlock: 0,
                  toBlock: "latest"
                }
              )
              .watch((error, event) => {
                if (error) {
                  callback(error, null);
                }
                console.log(`${event.args.project} removed`);
                callback(null, event);
              });
          }
        );
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
    let logIndexN = -1;
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(
          window.web3.eth.defaultAccount,
          "",
          () => {
            const proxyCNV = window.web3.eth.contract(baseJSONCNV.abi);
            const cnv = proxyCNV.at(CNV_ADDRESS);
            web3.eth.estimateGas(
              {
                data: baseJSON.bytecode,
                from: web3.eth.defaultAccount
              },
              (err, res) => {
                if (err) {
                  console.error(err);
                } else {
                  const gas = res;
                  web3.eth.getGasPrice((err, res) => {
                    if (err) {
                      console.error(err);
                    } else {
                      const gasPrice = res;
                      cnv.addProject(
                        project_address,
                        { gas, gasPrice },
                        (error, instance) => {
                          const filter = web3.eth.filter({
                            toBlock: "latest"
                          });
                          filter.watch((error, log) => {
                            if (
                              log.transactionHash &&
                              log.transactionHash ===
                                instance.transactionHash &&
                              logIndexN < 0
                            ) {
                              if (error) {
                                callback(error, null);
                              } else {
                                logIndexN = log.logIndex;
                                callback(null, instance);
                                filter.stopWatching();
                              }
                            }
                          });
                        }
                      );
                    }
                  });
                }
              }
            );
          }
        );
      }
    });
  },
  removeProject(project_address, callback) {
    let logIndexN = -1;
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(
          window.web3.eth.defaultAccount,
          "",
          () => {
            const proxyCNV = window.web3.eth.contract(baseJSONCNV.abi);
            const cnv = proxyCNV.at(CNV_ADDRESS);
            cnv.removeProject(project_address, (error, instance) => {
              const filter = web3.eth.filter({
                toBlock: "latest"
              });
              filter.watch((error, log) => {
                if (
                  log.transactionHash &&
                  log.transactionHash === instance.transactionHash &&
                  logIndexN < 0
                ) {
                  if (error) {
                    callback(error, null);
                  } else {
                    logIndexN = log.logIndex;
                    callback(null, instance);
                    filter.stopWatching();
                  }
                }
              });
            });
          }
        );
      }
    });
  },
  balanceOf(project_address, account_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(
          window.web3.eth.defaultAccount,
          "",
          () => {
            const proxySAS = window.web3.eth.contract(baseJSON.abi);
            const proyecto = proxySAS.at(project_address);
            proyecto.balanceOf(account_address, (error, res) => {
              if (error) {
                callback(error, null);
              } else {
                callback(null, res);
              }
            });
          }
        );
      }
    });
  },
  transfer(project_address, to_address, cant_tokens, callback) {
    let logIndexN = -1;
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(
          window.web3.eth.defaultAccount,
          "",
          () => {
            const proxySAS = window.web3.eth.contract(baseJSON.abi);
            const proyecto = proxySAS.at(project_address);
            proyecto.transfer(to_address, cant_tokens, (error, instance) => {
              const filter = web3.eth.filter({
                toBlock: "latest"
              });
              filter.watch((error, log) => {
                if (
                  log.transactionHash &&
                  log.transactionHash === instance.transactionHash &&
                  logIndexN < 0
                ) {
                  if (error) {
                    callback(error, null);
                  } else {
                    let logIndexN = log.logIndex;
                    callback(null, instance);
                    filter.stopWatching();
                  }
                }
              });
            });
          }
        );
      }
    });
  },
  closeRound(project_address, callback) {
    let logIndexN = -1;
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(
          window.web3.eth.defaultAccount,
          "",
          () => {
            const proxySAS = window.web3.eth.contract(baseJSON.abi);
            const proyecto = proxySAS.at(project_address);
            proyecto.closeRound((error, instance) => {
              const filter = web3.eth.filter({
                toBlock: "latest"
              });
              filter.watch((error, log) => {
                if (
                  log.transactionHash &&
                  log.transactionHash === instance.transactionHash &&
                  logIndexN < 0
                ) {
                  if (error) {
                    callback(error, null);
                  } else {
                    logIndexN = log.logIndex;
                    callback(null, instance);
                    filter.stopWatching();
                  }
                }
              });
            });
          }
        );
      }
    });
  },
  isProjectClosed(project_address, callback) {
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(
          window.web3.eth.defaultAccount,
          "",
          () => {
            const proxySAS = window.web3.eth.contract(baseJSON.abi);
            const proyecto = proxySAS.at(project_address);
            proyecto.m_closed_round((error, res) => {
              if (error) {
                callback(error, null);
              } else {
                callback(null, res);
              }
            });
          }
        );
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
    let logIndexN = -1;
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(
          window.web3.eth.defaultAccount,
          "",
          () => {
            const proxyCNV = window.web3.eth.contract(baseJSONCNV.abi);
            const cnv = proxyCNV.at(CNV_ADDRESS);
            cnv.addBeneficiary(beneficiary_address, (error, instance) => {
              const filter = web3.eth.filter({
                toBlock: "latest"
              });
              filter.watch((error, log) => {
                if (
                  log.transactionHash &&
                  log.transactionHash === instance.transactionHash &&
                  logIndexN < 0
                ) {
                  if (error) {
                    callback(error, null);
                  } else {
                    logIndexN = log.logIndex;
                    callback(null, instance);
                    filter.stopWatching();
                  }
                }
              });
            });
          }
        );
      }
    });
  },
  removeBeneficiary(beneficiary_address, callback) {
    let logIndexN = -1;
    web3Init((error, accounts) => {
      if (error) {
        console.error(error);
      } else {
        window.web3.eth.defaultAccount = accounts[0];
        window.web3.personal.unlockAccount(
          window.web3.eth.defaultAccount,
          "",
          () => {
            const proxyCNV = window.web3.eth.contract(baseJSONCNV.abi);
            const cnv = proxyCNV.at(CNV_ADDRESS);
            cnv.removeBeneficiary(beneficiary_address, (error, instance) => {
              const filter = web3.eth.filter({
                toBlock: "latest"
              });
              filter.watch((error, log) => {
                if (
                  log.transactionHash &&
                  log.transactionHash === instance.transactionHash &&
                  logIndexN < 0
                ) {
                  if (error) {
                    callback(error, null);
                  } else {
                    logIndexN = log.logIndex;
                    callback(null, instance);
                    filter.stopWatching();
                  }
                }
              });
            });
          }
        );
      }
    });
  }
};
