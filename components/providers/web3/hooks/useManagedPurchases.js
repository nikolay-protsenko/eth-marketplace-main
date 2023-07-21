

import { normalizeOwnedPurchase } from "@utils/normalize"
import useSWR from "swr"

export const handler = (web3, contract) => account => {

  const swrRes = useSWR(() =>
    (web3 &&
    contract &&
    account.data && account.isAdmin ) ? `web3/managedPurchases/${account.data}` : null,
    async () => {
      const purchases = []
      const purchaseCount = await contract.methods.getPurchaseCount().call()

      for (let i = Number(purchaseCount) - 1; i >= 0; i--) {
        const purchaseHash = await contract.methods.getPurchaseHashAtIndex(i).call()
        const purchase = await contract.methods.getPurchaseByHash(purchaseHash).call()

        if (purchase) {
          const normalized = normalizeOwnedPurchase(web3)({ hash: purchaseHash }, purchase)
          purchases.push(normalized)
        }
      }

      return purchases
    }
  )

  return swrRes
}
