var WETH = artifacts.require("WETH9");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(WETH);
};