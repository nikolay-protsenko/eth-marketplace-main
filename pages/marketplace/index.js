

import { PurchaseCard, PurchaseList } from "@components/ui/purchase"
import { BaseLayout } from "@components/ui/layout"
import { getAllPurchases } from "@content/purchases/fetcher"
import { useOwnedPurchases, useWalletInfo } from "@components/hooks/web3"
import { Button, Loader, Message } from "@components/ui/common"
import { OrderModal } from "@components/ui/order"
import { useState } from "react"
import { MarketHeader } from "@components/ui/marketplace"
import { useWeb3 } from "@components/providers"
import { withToast } from "@utils/toast"

export default function Marketplace({purchases}) {
  const { web3, contract, requireInstall } = useWeb3()
  const { hasConnectedWallet, isConnecting, account } = useWalletInfo()
  const { ownedPurchases } = useOwnedPurchases(purchases, account.data)

  const [selectedPurchase, setSelectedPurchase] = useState(null)
  const [busyPurchaseId, setBusyPurchaseId] = useState(null)
  const [isNewPurchase, setIsNewPurchase] = useState(true)

  const purchasePurchase = async (order, purchase) => {
    const hexPurchaseId = web3.utils.utf8ToHex(purchase.id)
    const orderHash = web3.utils.soliditySha3(
      { type: "bytes16", value: hexPurchaseId },
      { type: "address", value: account.data }
    )

    const value = web3.utils.toWei(String(order.price))

    setBusyPurchaseId(purchase.id)
    if (isNewPurchase) {
      const emailHash = web3.utils.sha3(order.email)
      const proof = web3.utils.soliditySha3(
        { type: "bytes32", value: emailHash },
        { type: "bytes32", value: orderHash }
      )

      withToast(_purchasePurchase({hexPurchaseId, proof, value}, purchase))
    } else {
      withToast(_repurchasePurchase({purchaseHash: orderHash, value}, purchase))
    }
  }

  const _purchasePurchase = async ({hexPurchaseId, proof, value}, purchase) => {
    try {
      const result = await contract.methods.purchasePurchase(
        hexPurchaseId,
        proof
      ).send({from: account.data, value})

      ownedPurchases.mutate([
        ...ownedPurchases.data, {
          ...purchase,
          proof,
          state: "purchased",
          owner: account.data,
          price: value
        }
      ])
      return result
    } catch(error) {
      throw new Error(error.message)
    } finally {
      setBusyPurchaseId(null)
    }
  }

  const _repurchasePurchase = async ({purchaseHash, value}, purchase) => {
    try {
      const result = await contract.methods.repurchasePurchase(
        purchaseHash
      ).send({from: account.data, value})

      const index = ownedPurchases.data.findIndex(c => c.id === purchase.id)

      if (index >= 0) {
        ownedPurchases.data[index].state = "purchased"
        ownedPurchases.mutate(ownedPurchases.data)
      } else {
        ownedPurchases.mutate()

      }
      return result
    } catch(error) {
      throw new Error(error.message)
    } finally {
      setBusyPurchaseId(null)
    }
  }

  const cleanupModal = () => {
    setSelectedPurchase(null)
    setIsNewPurchase(true)
  }

  return (
    <>
      <MarketHeader />
      <PurchaseList
        purchases={purchases}
      >
      {purchase => {
        const owned = ownedPurchases.lookup[purchase.id]
        return (
          <PurchaseCard
            key={purchase.id}
            purchase={purchase}
            state={owned?.state}
            disabled={!hasConnectedWallet}
            Footer={() => {
              if (requireInstall) {
                return (
                  <Button
                    size="sm"
                    disabled={true}
                    variant="lightPurple">
                    Install
                  </Button>
                )
              }

              if (isConnecting) {
                return (
                  <Button
                    size="sm"
                    disabled={true}
                    variant="lightPurple">
                    <Loader size="sm" />
                  </Button>
                )
              }

              if (!ownedPurchases.hasInitialResponse) {
                return (
                  // <div style={{height: "42px"}}></div>
                  <Button
                    variant="white"
                    disabled={true}
                    size="sm">
                    { hasConnectedWallet ?
                      "Loading State..." :
                      "Connect"
                    }
                  </Button>
                )
              }

              const isBusy = busyPurchaseId === purchase.id
              if (owned) {
                return (
                  <>
                    <div className="flex">
                      <Button
                        onClick={() => alert("You are owner of this purchase.")}
                        disabled={false}
                        size="sm"
                        variant="white">
                        Yours &#10004;
                      </Button>
                      { owned.state === "deactivated" &&
                        <div className="ml-1">
                          <Button
                            size="sm"
                            disabled={isBusy}
                            onClick={() => {
                              setIsNewPurchase(false)
                              setSelectedPurchase(purchase)
                            }}
                            variant="purple">
                            { isBusy ?
                              <div className="flex">
                                <Loader size="sm" />
                                <div className="ml-2">In Progress</div>
                              </div> :
                              <div>Fund to Activate</div>
                            }
                          </Button>
                        </div>
                      }
                    </div>
                  </>
                )
              }


              return (
                <Button
                  onClick={() => setSelectedPurchase(purchase)}
                  size="sm"
                  disabled={!hasConnectedWallet || isBusy}
                  variant="lightPurple">
                  { isBusy ?
                   <div className="flex">
                      <Loader size="sm" />
                      <div className="ml-2">In Progress</div>
                   </div> :
                  <div>Purchase</div>
                  }
                </Button>
              )}
            }
          />
        )}
      }
      </PurchaseList>
      { selectedPurchase &&
        <OrderModal
          purchase={selectedPurchase}
          isNewPurchase={isNewPurchase}
          onSubmit={(formData, purchase) => {
            purchasePurchase(formData, purchase)
            cleanupModal()
          }}
          onClose={cleanupModal}
        />
      }
    </>
  )
}

export function getStaticProps() {
  const { data } = getAllPurchases()
  return {
    props: {
      purchases: data
    }
  }
}

Marketplace.Layout = BaseLayout
