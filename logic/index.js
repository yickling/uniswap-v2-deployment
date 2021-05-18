const fs = require('fs')
const Tx = require('ethereumjs-tx')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/583aa3fd29394208bee43d6d211c0762"));
const privKey = '4776705768145a4e3c053120b01189a60d93166b65294b4f07203c39cefd358d' // process.env.privateKey

// the account address that will send the test transaction
const addressFrom = '0x1D5c57053e306D97B3CA014Ca1deBd2882b325eD'
const addressA = '0x217673271692b6181ea113d93384885436a9316a' // alphacoin
const addressB = '0x4b0fac9de4f5444b0652628e832c0cbebecdc7db' // betacoin
// const addressC = '0x315ee5b4ac9692db881ab710b180cc8b918e89a1' // sigmacoin
const addressUniswapFactory = '0x2f950feed3ba831b8da510b62b741ac594188485'

const overrides = {
  gasLimit: 9999999
}

async function call(transaction, account) {
  return await transaction.call({from: account});
}

var routerAbi = fs.readFileSync('./abi/router.json')

var pairAbi = fs.readFileSync('./abi/pair.json')

var factoryAbi = fs.readFileSync('./abi/factory.json')

var alphaCoinAbi = fs.readFileSync('./abi/alphacoin.json')

var betaCoinAbi = fs.readFileSync('./abi/betacoin.json')

var sigmaCoinAbi = fs.readFileSync('./abi/sigmacoin.json')

async function sendSigned(txData) {
  const privateKey = new Buffer(privKey, 'hex')
  const transaction = new Tx(txData)
  transaction.sign(privateKey)
  const serializedTx = transaction.serialize().toString('hex')
  return web3.eth.sendSignedTransaction('0x' + serializedTx)
}

const createPair = async () => {
  // javascript:  transact with deployed Uniswap Factory contract - createPair

  // the Uniswap factory contract address
  const addressTo = addressUniswapFactory
  const contract = new web3.eth.Contract(JSON.parse(factoryAbi), addressTo);
  const tx = contract.methods.createPair(addressA, // alphacoin
  addressB); // betacoin
  const encodedABI = tx.encodeABI();

  // get the number of transactions sent so far so we can create a fresh nonce
  web3.eth.getTransactionCount(addressFrom).then(async txCount => {
    // construct the transaction data
    const txData = {
      nonce: web3.utils.toHex(txCount),
      gasLimit: web3.utils.toHex(6000000),
      gasPrice: web3.utils.toHex(10000000000),
      to: addressTo,
      from: addressFrom,
      data: encodedABI
    }

    // fire away!
    try {
      await sendSigned(txData)
    } catch (err) {
      console.error('error', err)
    }

  })
}

const getExchangeAddress = async () => {
  const account = '0x1D5c57053e306D97B3CA014Ca1deBd2882b325eD';
  const uniswap = new web3.eth.Contract(JSON.parse(factoryAbi), addressUniswapFactory);

  const exchange = await call(uniswap.methods.getPair(addressA, // alphacoin
  addressB), account);  // betacoin
  console.error("the swap address for AlphaCoin-BetaCoin is:" + exchange)

  return exchange
}

const transferFrom = async(addressPair) => {
  // approve
  const ERC20_TOKEN_ADDED = web3.utils.toHex(5) 
  const alphacoin = new web3.eth.Contract(JSON.parse(alphaCoinAbi), addressA);

  let balance = await call(alphacoin.methods.balanceOf(addressFrom));
  console.info('>>> alphacoin balance: ', balance)

  let allowance = await call(alphacoin.methods.allowance(addressFrom, addressPair));
  console.info('>>> alphacoin allowance to A-B pair: ', allowance)

  const tx = alphacoin.methods.transferFrom(
    addressFrom,
    addressPair,
    5
    );

  const encodedAbi = tx.encodeABI();
  let txCount = await web3.eth.getTransactionCount(addressFrom)

  const tx1Data = {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(6000000),
    gasPrice: web3.utils.toHex(10000000000),
    to: addressA,
    from: addressFrom,
    data: encodedAbi
  }

  // fire away!
  try {
    let result = await sendSigned(tx1Data)
    console.info('>>> successfully transferFrom alphacoin: ', result)

    // const betacoin = new web3.eth.Contract(JSON.parse(betaCoinAbi), addressB);
    // const tx2 = betacoin.methods.transferFrom(
    //   addressFrom,
    //   addressPair,
    //   TOKEN_ADDED
    //   );

    // const encodedAbi2 = tx2.encodeABI();

    // txCount = await web3.eth.getTransactionCount(addressFrom)

    // const tx2Data = {
    //   nonce: web3.utils.toHex(txCount),
    //   gasLimit: web3.utils.toHex(6000000),
    //   gasPrice: web3.utils.toHex(10000000000),
    //   to: addressB,
    //   from: addressFrom,
    //   data: encodedAbi2
    // }

    // result = await sendSigned(tx2Data)
    // console.info('>>> successfully transferFrom betacoin: ', result)

    return result
  } catch (err) {
    console.error('error', err)
  }
}

const approveAndTransfer = async(addressPair, addressRouter) => {
  // approve
  // const ERC20_TOKEN_ADDED = web3.utils.toHex(5 * 10 ** 18) 
  const ERC20_TOKEN_ADDED = 500 * 10 ** 2
  // const TOKEN_ADDED = web3.utils.toHex(5*10**18) 
  const alphacoin = new web3.eth.Contract(JSON.parse(alphaCoinAbi), addressA);
  const tx = alphacoin.methods.approve(
    addressRouter,
    ERC20_TOKEN_ADDED
    );

  const encodedAbi = tx.encodeABI();
  let txCount = await web3.eth.getTransactionCount(addressFrom)

  const tx1Data = {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(6000000),
    gasPrice: web3.utils.toHex(10000000000),
    to: addressA,
    from: addressFrom,
    data: encodedAbi
  }

  // fire away!
  try {
    console.log(tx1Data)
    let result = await sendSigned(tx1Data)
    console.info('successfully approved alphacoin: ', result)

    const betacoin = new web3.eth.Contract(JSON.parse(betaCoinAbi), addressB);
    const tx2 = betacoin.methods.approve(
      addressRouter,
      ERC20_TOKEN_ADDED
      );

    const encodedAbi2 = tx2.encodeABI();

    txCount = await web3.eth.getTransactionCount(addressFrom)

    const tx2Data = {
      nonce: web3.utils.toHex(txCount),
      gasLimit: web3.utils.toHex(6000000),
      gasPrice: web3.utils.toHex(10000000000),
      to: addressB,
      from: addressFrom,
      data: encodedAbi2
    }

    console.log(tx2Data)
    result = await sendSigned(tx2Data)
    console.info('successfully approved betacoin: ', result)

    return result
  } catch (err) {
    console.error('error', err)
  }
}

const addLiquidity = async(addressRouter) => {
  // add liquidity
  // const TOKEN_ADDED = web3.utils.toHex(5) // web3.utils.toHex(5*10**18) 
  const TOKEN_ADDED = 500 * 10 ** 2
  const ETH_ADDED = web3.utils.toHex(1*10**17) // 0.1 ETH
  const router = new web3.eth.Contract(JSON.parse(routerAbi), addressRouter);
  const tx1 = router.methods.addLiquidity(
    addressA, // address tokenA,
    addressB,
    TOKEN_ADDED, // uint amountADesired,
    TOKEN_ADDED, // uint amountBDesired,
    web3.utils.toHex(1), // uint amountAMin,
    web3.utils.toHex(1), // uint amountBMin,
    addressFrom, // address to,
    web3.utils.toHex(1720137849)// (~~(Date.now() / 1000)  + 360)// uint deadline
    );

  let quote = await call(router.methods.quote(1, 1, 1), addressFrom);
  console.info('quote: ', quote)
  const encodedABIAddLiquidity = tx1.encodeABI();
  let txCount = await web3.eth.getTransactionCount(addressFrom)

  const tx1Data = {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(6000000),
    gasPrice: web3.utils.toHex(10000000000),
    to: addressRouter,
    from: addressFrom,
    data: encodedABIAddLiquidity,
    // value: ETH_ADDED,
  }

  // fire away!
  try {
    const result = await sendSigned(tx1Data)
    console.info('successfully added liquidity to A-B: ', result)
  } catch (err) {
    console.error('error', err)
  }
}


const checkPair = async(addressPair) => {
  const pairContract = new web3.eth.Contract(JSON.parse(pairAbi), addressPair);
  
  const reserves = await call(pairContract.methods.getReserves());
  console.log("Reserves for AlphaCoin-BetaCoin:", reserves)

  let balance = await call(pairContract.methods.balanceOf(addressFrom));
  console.log(">> User Balance of AlphaCoin-BetaCoin:", balance)


  balance = await call(pairContract.methods.balanceOf(addressFrom));
  console.log(">> User Allowance of LP tokens:", balance)

  const alphacoin = new web3.eth.Contract(JSON.parse(alphaCoinAbi), addressA);
  const betacoin = new web3.eth.Contract(JSON.parse(betaCoinAbi), addressB);

  console.log(">> Pair Balance AlphaCoin:", await call(alphacoin.methods.balanceOf(addressPair)))
  console.log(">> Pair Balance BetaCoin:", await call(betacoin.methods.balanceOf(addressPair)))
}


const checkLiquidity = async(addressFactory) => {
  const account = '0x1D5c57053e306D97B3CA014Ca1deBd2882b325eD';
  const uniswap = new web3.eth.Contract(JSON.parse(factoryAbi), addressFactory);
  
  let pairsCount = await call(uniswap.methods.allPairsLength(), account);
  console.error('# of pairs: ', pairsCount)

  const addressAB = await call(uniswap.methods.getPair(addressA, // alphacoin
    addressB), account);  // betacoin
  console.log('hello', addressAB)
  const pairAB = new web3.eth.Contract(JSON.parse(pairAbi), addressAB);
  console.log('2', pairAB)
  const reserves = await call(pairAB.methods.getReserves());
  console.log('3')
  console.error("Reserves for AlphaCoin-BetaCoin:", reserves)

  let balance = await call(pairAB.methods.balanceOf(addressFrom));
  console.error(">> User Balance of AlphaCoin-BetaCoin:", balance)


  balance = await call(pairAB.methods.balanceOf(addressFrom));
  console.error(">> User Allowance of LP tokens:", balance)
}

const swap = async(addressRouter, address1st, address2nd) => {
  const router = new web3.eth.Contract(JSON.parse(routerAbi), addressRouter);
  
  const tx = router.methods.swapTokensForExactTokens(
    web3.utils.toHex(100), // uint amountOut,
    web3.utils.toHex(150), // uint amountInMax,
    [ address1st, address2nd ], // address[] calldata path,
    addressFrom, // address to,
    web3.utils.toHex(1720137849)// (~~(Date.now() / 1000)  + 360)// uint deadline
    );

  const encodedABISwap = tx.encodeABI();

  const txCount = await web3.eth.getTransactionCount(addressFrom);
  const txData = {
    nonce: web3.utils.toHex(txCount),
    gasLimit: web3.utils.toHex(6000000),
    gasPrice: web3.utils.toHex(10000000000),
    to: addressRouter,
    from: addressFrom,
    data: encodedABISwap,
  }

  // fire away!
  try {
    const result = await sendSigned(txData)
    console.info('successfully swapped to A-B: ', result)
  } catch (err) {
    console.error('error', err)
  }
}

(async function () {
  let result = undefined
  const addressRouter = '0xf74DB6F0A8609aD48a40ecf4069e7aBa6d50e1c1';
  console.info('======================================================')
  console.info('===========           Pre-swap           =============')
  console.info('======================================================')
  // await checkLiquidity(addressUniswapFactory)
  // result = await createPair()
  // console.log(123, result)
  const addressPair = await getExchangeAddress() //0x6bae99e1daf865c2936f3084a8ff6f6538d0cbbc
  console.log("LP pair: ", addressPair)
  await checkPair(addressPair)
  result = await approveAndTransfer(addressPair, addressRouter)
  await checkPair(addressPair)
  // // result = await transferFrom(addressPair)
  await addLiquidity(addressRouter)
  // await swap(addressRouter, addressA, addressB)
  // console.info('======================================================')
  // console.info('===========         Post-swap            =============')
  // console.info('======================================================')
  // await checkLiquidity(addressUniswapFactory)
  // await swap(addressRouter, addressB, addressA)
  // console.info('======================================================')
  // console.info('===========       Post-swapback          =============')
  // console.info('======================================================')
  // await checkLiquidity(addressUniswapFactory)
  // // await swap() // swapback
})()