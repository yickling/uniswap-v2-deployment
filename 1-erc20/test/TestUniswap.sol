pragma solidity >=0.4.25 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Token1.sol";
// import "../contracts/Token2.sol";

contract TestAlphaCoin {

  function testInitialBalanceUsingDeployedContract() public {
    AlphaCoin a = AlphaCoin(DeployedAddresses.AlphaCoin());

    uint expected = 10000;

    Assert.equal(a.balanceOf(tx.origin), expected, "Owner should have 10000 AlphaCoin initially");
  }

  function testInitialBalanceWithNewMetaCoin() public {
    AlphaCoin a = new AlphaCoin();

    uint expected = 10000;

    Assert.equal(a.balanceOf(tx.origin), expected, "Owner should have 10000 AlphaCoin initially");
  }

}
