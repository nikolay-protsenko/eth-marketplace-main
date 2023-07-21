
import { handler as createAccountHook } from "./useAccount"
import { handler as createNetworkHook } from "./useNetwork"
import { handler as createOwnedPurchasesHook } from "./useOwnedPurchases"
import { handler as createOwnedPurchaseHook } from "./useOwnedPurchase"
import { handler as createManagedPurchasesHook } from "./useManagedPurchases"


export const setupHooks = ({web3, provider, contract}) => {
  return {
    useAccount: createAccountHook(web3, provider),
    useNetwork: createNetworkHook(web3),
    useOwnedPurchases: createOwnedPurchasesHook(web3, contract),
    useOwnedPurchase: createOwnedPurchaseHook(web3, contract),
    useManagedPurchases: createManagedPurchasesHook(web3, contract),
  }
}
