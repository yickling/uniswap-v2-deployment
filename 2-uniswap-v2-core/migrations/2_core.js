var UniswapV2Factory = artifacts.require("UniswapV2Factory");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(UniswapV2Factory, '0x5D3babc23FE2b1146b1dB079E3823D1133FF8d65');
};