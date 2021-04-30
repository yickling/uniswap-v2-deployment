const json = require('@uniswap/v2-core/build/UniswapV2Factory.json')
const contract = require('@truffle/contract');
const UniswapV2Factory = contract(json);

UniswapV2Factory.setProvider(this.web3._provider);

module.exports = function(_deployer, network, accounts) {
    _deployer.deploy(UniswapV2Factory, accounts[0], {from: accounts[0]})
};

// const { ethers } = require("ethers");
// const UniswapV2FactoryBytecode = require('@uniswap/v2-core/build/UniswapV2Factory.json').bytecode

// module.exports = async function(_deployer, network, accounts) {
//     const UniswapV2Library = await ethers.getContractFactory(
//         [
//           "constructor(address _feeToSetter)",
//           "function createPair(address tokenA, address tokenB) external returns (address pair)",
//         ],
//         UniswapV2FactoryBytecode
//       );
//       const [owner] = await ethers.getSigners();
//       const uniswapV2Library = await UniswapV2Library.deploy(owner.address);

// };

// const UniswapV2Factory = artifacts.require("UniswapV2Factory");
// const UniswapV2Router02 = artifacts.require("UniswapV2Router02");
// const feeToSetter = ' 設置手續費賬戶的管理員地址 ';
// const WETH = { mainnet: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
//     ropsten: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
//     rinkeby: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
//     goerli: '0xB4FBF271143F4FBf7 B91A5ded31805e42b2208d6',
//     kovan: '0xd0A1E359811322d97991E03f863a0C30C2cF029C' };
// module.exports = (deployer, network, accounts) => {
//     deployer.deploy(UniswapV2Factory)
//         .then((FactoryInstance) => {
//             return deployer.deploy(UniswapV2Router02, FactoryInstance.address);
//          }); 
//     };
