var UniswapV2Router02 = artifacts.require("UniswapV2Router02");
var SigmaCoin = artifacts.require("SigmaCoin");
const addressWETH9 = '0xc778417E063141139Fce010982780140Aa0cD5Ab';
const addressFactory = '0xB989ff9fEe9C5906198E9d1dcE0E1361e12Cfa48';
module.exports = function(deployer) {
  // deployment steps
  // deployer.deploy(UniswapV2Router01, addressFactory, addressWETH9, { gas: 670000000 });
  deployer.deploy(UniswapV2Router02, addressFactory, addressWETH9);
  // deployer.deploy(SigmaCoin);
};