var UniswapV2Router02 = artifacts.require("UniswapV2Router02");
var SigmaCoin = artifacts.require("SigmaCoin");
const addressWETH9 = '0xd1F3C643Fc68f86bB9cf59E719bDDCfb986532aa';
const addressFactory = '0x2f950feed3ba831b8da510b62b741ac594188485';
module.exports = function(deployer) {
  // deployment steps
  // deployer.deploy(UniswapV2Router01, addressFactory, addressWETH9, { gas: 670000000 });
  deployer.deploy(UniswapV2Router02, addressFactory, addressWETH9);
  // deployer.deploy(SigmaCoin);
};