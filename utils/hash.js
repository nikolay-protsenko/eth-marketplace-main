


export const createPurchaseHash = web3 => (purchaseId, account) => {
  const hexPurchaseId = web3.utils.utf8ToHex(purchaseId)
  const purchaseHash = web3.utils.soliditySha3(
    { type: "bytes16", value: hexPurchaseId },
    { type: "address", value: account }
  )

  return purchaseHash
}
