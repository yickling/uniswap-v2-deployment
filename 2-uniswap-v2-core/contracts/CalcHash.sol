pragma solidity =0.5.16;
import './core/UniswapV2Pair.sol';

contract CalcHash {
    function getInitHash() public pure returns(bytes32){
        bytes memory bytecode = type(UniswapV2Pair).creationCode;
        return keccak256(abi.encodePacked(bytecode));
    }
}