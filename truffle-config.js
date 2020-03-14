require('@babel/register');
require("dotenv").config();

const HDWalletProvider = require("truffle-hdwallet-provider");
const qxProvider = new HDWalletProvider(process.env.QX_MNEMONIC_RINKEBY, process.env.URL_PROVIDER);

module.exports = {
  mocha: {
    enableTimeouts: false,
    before_timeout: 2400000 // Here is 2min but can be whatever timeout is suitable for you.
  },
  compilers: {
    solc: {
      version: '0.5.7',
      settings: {
        optimizer: {
          enabled: true,
          runs: 500,
        },
        evmVersion: 'constantinople',
      },
    },
  },
  networks: {
    development: {
      host: '127.0.0.1',
      network_id: '*',
      port: 8545
    },
    rinkeby: {
      provider: qxProvider,
      network_id: 4,
      skipDryRun: true
    },
  },
};
