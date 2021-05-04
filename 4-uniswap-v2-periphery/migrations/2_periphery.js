var UniswapV2Router02 = artifacts.require("UniswapV2Router02");
var SigmaCoin = artifacts.require("SigmaCoin");
const addressWETH9 = '0x0b4c433c6d00177aEbC1fAbC93299A80a932d12a';
const addressFactory = '0x612CCeAce5392A8D7f64362975E8f95D8ec4BF83';
module.exports = function(deployer) {
  // deployment steps
  // deployer.deploy(UniswapV2Router01, addressFactory, addressWETH9, { gas: 670000000 });
  deployer.deploy(UniswapV2Router02, addressFactory, addressWETH9);
  deployer.deploy(SigmaCoin);
};