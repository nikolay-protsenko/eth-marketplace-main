

import { createPurchaseHash } from "@utils/hash"
import { normalizeOwnedPurchase } from "@utils/normalize"
import useSWR from "swr"

export const handler = (web3, contract) => (purchases, account) => {
  const swrRes = useSWR(() =>
    (web3 &&
     contract &&
     account) ? `web3/ownedPurchases/${account}` : null,
    async () => {
      const ownedPurchases = []
      for (let i = 0; i < purchases.length; i++) {
        const purchase = purchases[i]

        if (!purchase.id) { continue }

        const purchaseHash = createPurchaseHash(web3)(purchase.id, account)
        const ownedPurchase = await contract.methods.getPurchaseByHash(purchaseHash).call()

        if (ownedPurchase.owner !== "0x0000000000000000000000000000000000000000") {
          const normalized = normalizeOwnedPurchase(web3)(purchase, ownedPurchase)
          ownedPurchases.push(normalized)
        }
      }

      return ownedPurchases
    }
  )

  return {
    ...swrRes,
    lookup: swrRes.data?.reduce((a, c) => {
      a[c.id] = c
      return a
    }, {}) ?? {}
  }
}
