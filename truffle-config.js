
const HDWalletProvider = require("@truffle/hdwallet-provider")
const keys =  require("./keys.json")

module.exports = {
  contracts_build_directory: "./public/contracts",
  networks: {
    development: {
     host: "127.0.0.1",
     port: 7545,
     network_id: "*",
    },
    // goerli: {
    //   provider: () =>
    //     new HDWalletProvider({
    //       mnemonic: {
    //         phrase: keys.MNEMONIC
    //       },
    //       providerOrUrl: `https://ropsten.infura.io/v3/${keys.INFURA_PROJECT_ID}`,
    //       addressIndex: 0
    //     }),
    //   network_id: 5,
    //   gas: 5500000, // Gas Limit, How much gas we are willing to spent
    //   gasPrice: 20000000000, // how much we are willing to spent for unit of gas
    //   confirmations: 2, // number of blocks to wait between deployment
    //   timeoutBlocks: 200 // number of blocks before deployment times out
    // }
    goerli: {
      provider: () =>
        new HDWalletProvider(
           keys.PRIVATE_KEY,
           keys.INFURA_GOERLI_URL,
         ),
      network_id: 5,
      gas: 5500000, // Gas Limit, How much gas we are willing to spent
      gasPrice: 30000000000, // how much we are willing to spent for unit of gas
      confirmations: 2, // number of blocks to wait between deployment
      timeoutBlocks: 200 // number of blocks before deployment times out
    }
  },
  compilers: {
    solc: {
      version: "0.8.4",
    }
  }
}



// NEXT_PUBLIC_TARGET_CHAIN_ID=1337
// NEXT_PUBLIC_NETWORK_ID=5777
 //9d7e3001c1e643cf9c752b475bd9e59f
 //bf04e1f348b947e2bab1136e6c99fe49
 //"PRIVATE_KEY":"039562534674e55f41569d8fbdcc3253ba6f3526c66a1a4ea0759bef5014df3f",

 //"PRIVATE_KEY":"law gown battle script dilemma disorder close gift awake cat excuse resource",
