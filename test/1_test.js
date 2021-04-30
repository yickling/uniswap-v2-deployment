const AlphaCoin = artifacts.require("AlphaCoin");

contract('AlphaCoin', (accounts) => {
  it('should put 10000 AlphaCoin in the first account', async () => {
    const alphaCoinInstance = await AlphaCoin.deployed();
    const balance = await alphaCoinInstance.getBalance.call(accounts[0]);

    assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
  });
  it('should call a function that depends on a linked library', async () => {
    const alphaCoinInstance = await AlphaCoin.deployed();
    const alphaCoinBalance = (await alphaCoinInstance.getBalance.call(accounts[0])).toNumber();
    const alphaCoinEthBalance = (await alphaCoinInstance.getBalanceInEth.call(accounts[0])).toNumber();

    assert.equal(alphaCoinEthBalance, 2 * alphaCoinBalance, 'Library function returned unexpected function, linkage may be broken');
  });
  it('should send coin correctly', async () => {
    const alphaCoinInstance = await AlphaCoin.deployed();

    // Setup 2 accounts.
    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    // Get initial balances of first and second account.
    const accountOneStartingBalance = (await alphaCoinInstance.getBalance.call(accountOne)).toNumber();
    const accountTwoStartingBalance = (await alphaCoinInstance.getBalance.call(accountTwo)).toNumber();

    // Make transaction from first account to second.
    const amount = 10;
    await alphaCoinInstance.sendCoin(accountTwo, amount, { from: accountOne });

    // Get balances of first and second account after the transactions.
    const accountOneEndingBalance = (await alphaCoinInstance.getBalance.call(accountOne)).toNumber();
    const accountTwoEndingBalance = (await alphaCoinInstance.getBalance.call(accountTwo)).toNumber();


    assert.equal(accountOneEndingBalance, accountOneStartingBalance - amount, "Amount wasn't correctly taken from the sender");
    assert.equal(accountTwoEndingBalance, accountTwoStartingBalance + amount, "Amount wasn't correctly sent to the receiver");
  });
});
