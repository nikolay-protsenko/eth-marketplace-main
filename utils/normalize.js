

export const PURCHASE_STATES = {
  0: "purchased",
  1: "activated",
  2: "deactivated",
}


export const normalizeOwnedPurchase = web3 => (purchase, ownedPurchase) => {
  return {
    ...purchase,
    ownedPurchaseId: ownedPurchase.id,
    proof: ownedPurchase.proof,
    owned: ownedPurchase.owner,
    price: web3.utils.fromWei(ownedPurchase.price),
    state: PURCHASE_STATES[ownedPurchase.state]
  }
}
