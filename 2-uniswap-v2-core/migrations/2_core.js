var UniswapV2Factory = artifacts.require("UniswapV2Factory");
var CalcHash = artifacts.require("CalcHash");

module.exports = async function(deployer) {
  // deployment steps
  await deployer.deploy(UniswapV2Factory, '0x5D3babc23FE2b1146b1dB079E3823D1133FF8d65');
  await deployer.deploy(CalcHash);
};