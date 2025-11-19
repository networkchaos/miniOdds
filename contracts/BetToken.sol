// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BetToken
 * @dev Governance token for miniOdds platform
 * Used for voting, staking, fee reduction, and governance
 */
contract BetToken is ERC20, ERC20Burnable, Ownable {
    uint256 public constant INITIAL_SUPPLY = 100_000_000 * 10**18; // 100M tokens
    uint256 public constant POOL_CREATION_STAKE = 50 * 10**18; // 50 BET tokens required to create pool
    
    mapping(address => bool) public authorizedMinters;
    
    event AuthorizedMinter(address indexed minter, bool authorized);
    
    constructor(address initialOwner) ERC20("miniOdds Token", "BET") Ownable(initialOwner) {
        _mint(initialOwner, INITIAL_SUPPLY);
    }
    
    /**
     * @dev Authorize/unauthorize a minter (e.g., PoolFactory for rewards)
     */
    function setAuthorizedMinter(address minter, bool authorized) external onlyOwner {
        authorizedMinters[minter] = authorized;
        emit AuthorizedMinter(minter, authorized);
    }
    
    /**
     * @dev Mint tokens (only by authorized minters)
     */
    function mint(address to, uint256 amount) external {
        require(authorizedMinters[msg.sender], "BetToken: Not authorized to mint");
        _mint(to, amount);
    }
    
    /**
     * @dev Get the required stake amount for pool creation
     */
    function getPoolCreationStake() external pure returns (uint256) {
        return POOL_CREATION_STAKE;
    }
}

