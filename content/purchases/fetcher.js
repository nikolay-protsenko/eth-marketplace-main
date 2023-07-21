

import purchases from "./index.json"

export const getAllPurchases = () => {

  return {
    data: purchases,
    purchaseMap: purchases.reduce((a, c, i) => {
      a[c.id] = c
      a[c.id].index = i
      return a
    }, {})
  }
}
