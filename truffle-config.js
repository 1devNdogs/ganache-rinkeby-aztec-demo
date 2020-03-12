require('@babel/register');
require("dotenv").config();

const HDWalletProvider = require("truffle-hdwallet-provider");
const qxProvider = new HDWalletProvider(process.env.QX_MNEMONIC_RINKEBY, process.env.URL_PROVIDER);

module.exports = {
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
    },
  },
};
