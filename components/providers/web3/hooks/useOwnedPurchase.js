

import { createPurchaseHash } from "@utils/hash"
import { normalizeOwnedPurchase } from "@utils/normalize"
import useSWR from "swr"

export const handler = (web3, contract) => (purchase, account) => {
  const swrRes = useSWR(() =>
    (web3 && contract && account) ? `web3/ownedPurchase/${account}` : null,
    async () => {
      const purchaseHash = createPurchaseHash(web3)(purchase.id, account)
      const ownedPurchase = await contract.methods.getPurchaseByHash(purchaseHash).call()

      if (ownedPurchase.owner === "0x0000000000000000000000000000000000000000") {
        return null
      }

      return normalizeOwnedPurchase(web3)(purchase, ownedPurchase)
    }
  )

  return swrRes
}
