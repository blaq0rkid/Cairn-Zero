// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CairnZeroForwarder
 * @notice Minimal forwarder for gasless meta-transactions
 * @dev Implements EIP-712 typed data signing for secure gasless transactions
 */
contract CairnZeroForwarder is EIP712, Ownable {
    using ECDSA for bytes32;

    struct ForwardRequest {
        address from;
        address to;
        uint256 value;
        uint256 gas;
        uint256 nonce;
        bytes data;
    }

    bytes32 private constant TYPEHASH =
        keccak256("ForwardRequest(address from,address to,uint256 value,uint256 gas,uint256 nonce,bytes data)");

    mapping(address => uint256) private _nonces;
    
    // Events
    event ForwardRequestExecuted(address indexed from, address indexed to, bool success);
    event NonceIncremented(address indexed user, uint256 newNonce);

    constructor() EIP712("CairnZeroForwarder", "1") Ownable(msg.sender) {}

    /**
     * @notice Get current nonce for an address
     * @param from Address to check nonce for
     * @return Current nonce value
     */
    function getNonce(address from) public view returns (uint256) {
        return _nonces[from];
    }

    /**
     * @notice Verify a forward request signature
     * @param req The forward request to verify
     * @param signature The signature to verify
     * @return bool True if signature is valid
     */
    function verify(ForwardRequest calldata req, bytes calldata signature) 
        public 
        view 
        returns (bool) 
    {
        address signer = _hashTypedDataV4(
            keccak256(abi.encode(
                TYPEHASH, 
                req.from, 
                req.to, 
                req.value, 
                req.gas, 
                req.nonce, 
                keccak256(req.data)
            ))
        ).recover(signature);

        return _nonces[req.from] == req.nonce && signer == req.from;
    }

    /**
     * @notice Execute a forward request
     * @param req The forward request to execute
     * @param signature The signature authorizing the request
     * @return success Whether the call succeeded
     * @return returndata The return data from the call
     */
    function execute(ForwardRequest calldata req, bytes calldata signature)
        public
        payable
        returns (bool success, bytes memory returndata)
    {
        require(verify(req, signature), "CairnZeroForwarder: signature does not match request");
        
        _nonces[req.from]++;
        emit NonceIncremented(req.from, _nonces[req.from]);

        // Execute the call with appended sender address
        (success, returndata) = req.to.call{gas: req.gas, value: req.value}(
            abi.encodePacked(req.data, req.from)
        );

        emit ForwardRequestExecuted(req.from, req.to, success);

        // Revert if call failed
        if (!success) {
            assembly {
                revert(add(returndata, 32), mload(returndata))
            }
        }

        return (success, returndata);
    }

    /**
     * @notice Emergency withdrawal function (owner only)
     */
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    /**
     * @notice Allow contract to receive ETH
     */
    receive() external payable {}
}
