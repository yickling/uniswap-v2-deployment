var Token1 = artifacts.require("AlphaCoin");
var Token2 = artifacts.require("BetaCoin");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(Token1);
  deployer.deploy(Token2);
};