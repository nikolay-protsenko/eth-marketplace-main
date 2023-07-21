// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract PurchaseMarketplace {

  enum State {
    Purchased,
    Activated,
    Deactivated
  }

  struct Purchase {
    uint id; // 32
    uint price; // 32
    bytes32 proof; // 32
    address owner; // 20
    State state; // 1
  }

  bool public isStopped = false;

  // mapping of purchaseHash to Purchase data
  mapping(bytes32 => Purchase) private ownedPurchases;

  // mapping of purchaseID to purchaseHash
  mapping(uint => bytes32) private ownedPurchaseHash;

  // number of all purchases + id of the purchase
  uint private totalOwnedPurchases;

  address payable private owner;

  constructor() {
    setContractOwner(msg.sender);
  }

  /// Purchase has invalid state!
  error InvalidState();

  /// Purchase is not created!
  error PurchaseIsNotCreated();

  /// Purchase has already a Owner!
  error PurchaseHasOwner();

  /// Sender is not purchase owner!
  error SenderIsNotPurchaseOwner();

  /// Only owner has an access!
  error OnlyOwner();

  modifier onlyOwner() {
    if (msg.sender != getContractOwner()) {
      revert OnlyOwner();
    }
    _;
  }

  modifier onlyWhenNotStopped {
    require(!isStopped);
    _;
  }

  modifier onlyWhenStopped {
    require(isStopped);
    _;
  }

  receive() external payable {}

  function withdraw(uint amount)
    external
    onlyOwner
  {
    (bool success, ) = owner.call{value: amount}("");
    require(success, "Transfer failed.");
  }

  function emergencyWithdraw()
    external
    onlyWhenStopped
    onlyOwner
  {
    (bool success, ) = owner.call{value: address(this).balance}("");
    require(success, "Transfer failed.");
  }

  function stopContract()
    external
    onlyOwner
  {
    isStopped = true;
  }

  function resumeContract()
    external
    onlyOwner
  {
    isStopped = false;
  }

  function purchasePurchase(
    bytes16 purchaseId, // 0x00000000000000000000000000003130
    bytes32 proof // 0x0000000000000000000000000000313000000000000000000000000000003130
  )
    external
    payable
    onlyWhenNotStopped
  {
    bytes32 purchaseHash = keccak256(abi.encodePacked(purchaseId, msg.sender));

    if (hasPurchaseOwnership(purchaseHash)) {
      revert PurchaseHasOwner();
    }

    uint id = totalOwnedPurchases++;

    ownedPurchaseHash[id] = purchaseHash;
    ownedPurchases[purchaseHash] = Purchase({
      id: id,
      price: msg.value,
      proof: proof,
      owner: msg.sender,
      state: State.Purchased
    });
  }

  function repurchasePurchase(bytes32 purchaseHash)
    external
    payable
    onlyWhenNotStopped
  {
    if (!isPurchaseCreated(purchaseHash)) {
      revert PurchaseIsNotCreated();
    }

    if (!hasPurchaseOwnership(purchaseHash)) {
      revert SenderIsNotPurchaseOwner();
    }

    Purchase storage purchase = ownedPurchases[purchaseHash];

    if (purchase.state != State.Deactivated) {
      revert InvalidState();
    }

    purchase.state = State.Purchased;
    purchase.price = msg.value;
  }

  function activatePurchase(bytes32 purchaseHash)
    external
    onlyWhenNotStopped
    onlyOwner
  {
    if (!isPurchaseCreated(purchaseHash)) {
      revert PurchaseIsNotCreated();
    }

    Purchase storage purchase = ownedPurchases[purchaseHash];

    if (purchase.state != State.Purchased) {
      revert InvalidState();
    }

    purchase.state = State.Activated;
  }

  function deactivatePurchase(bytes32 purchaseHash)
    external
    onlyWhenNotStopped
    onlyOwner
  {
    if (!isPurchaseCreated(purchaseHash)) {
      revert PurchaseIsNotCreated();
    }

    Purchase storage purchase = ownedPurchases[purchaseHash];

    if (purchase.state != State.Purchased) {
      revert InvalidState();
    }

    (bool success, ) = purchase.owner.call{value: purchase.price}("");
    require(success, "Transfer failed!");

    purchase.state = State.Deactivated;
    purchase.price = 0;
  }

  function transferOwnership(address newOwner)
    external
    onlyOwner
  {
    setContractOwner(newOwner);
  }

  function getPurchaseCount()
    external
    view
    returns (uint)
  {
    return totalOwnedPurchases;
  }

  function getPurchaseHashAtIndex(uint index)
    external
    view
    returns (bytes32)
  {
    return ownedPurchaseHash[index];
  }

  function getPurchaseByHash(bytes32 purchaseHash)
    external
    view
    returns (Purchase memory)
  {
    return ownedPurchases[purchaseHash];
  }

  function getContractOwner()
    public
    view
    returns (address)
  {
    return owner;
  }

  function setContractOwner(address newOwner) private {
    owner = payable(newOwner);
  }

  function isPurchaseCreated(bytes32 purchaseHash)
    private
    view
    returns (bool)
  {
    return ownedPurchases[purchaseHash].owner != 0x0000000000000000000000000000000000000000;
  }

  function hasPurchaseOwnership(bytes32 purchaseHash)
    private
    view
    returns (bool)
  {
    return ownedPurchases[purchaseHash].owner == msg.sender;
  }
}
