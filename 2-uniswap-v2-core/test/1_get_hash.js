const CalcHash = artifacts.require("CalcHash");

contract('CalcHash', (accounts) => {
  it('should calculate bytecode for pairFor initCodeHash', async () => {
    const calcHashInstance = await CalcHash.deployed();
    const result = await calcHashInstance.getInitHash.call();

    assert.equal(result, "96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f", "hash not equal");
  });
});