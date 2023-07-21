

import { useAdmin, useManagedPurchases } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Button, Message } from "@components/ui/common";
import { PurchaseFilter, ManagedPurchaseCard } from "@components/ui/purchase";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { normalizeOwnedPurchase } from "@utils/normalize";
import { withToast } from "@utils/toast";
import { useEffect, useState } from "react";

const VerificationInput = ({onVerify}) => {
  const [ email, setEmail ] = useState("")

  return (
    <div className="flex mr-2 relative rounded-md">
      <input
        value={email}
        onChange={({target: {value}}) => setEmail(value)}
        type="text"
        name="account"
        id="account"
        className="w-96 focus:ring-blue-500 shadow-md focus:border-blue-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
        placeholder="0x2341ab..." />
      <Button
        onClick={() => {
          onVerify(email)
        }}
      >
        Verify
      </Button>
    </div>
  )
}

export default function ManagedPurchases() {
  const [ proofedOwnership, setProofedOwnership ] = useState({})
  const [ searchedPurchase, setSearchedPurchase ] = useState(null)
  const [ filters, setFilters ] = useState({state: "all"})
  const { web3, contract } = useWeb3()
  const { account } = useAdmin({redirectTo: "/marketplace"})
  const { managedPurchases } = useManagedPurchases(account)

  const verifyPurchase = (email, {hash, proof}) => {
    if (!email) {
      return
    }

    const emailHash = web3.utils.sha3(email)
    const proofToCheck = web3.utils.soliditySha3(
      { type: "bytes32", value: emailHash },
      { type: "bytes32", value: hash }
    )

    proofToCheck === proof ?
      setProofedOwnership({
        ...proofedOwnership,
        [hash]: true
      }) :
      setProofedOwnership({
        ...proofedOwnership,
        [hash]: false
      })
  }

  const changePurchaseState = async (purchaseHash, method) => {
    try {
      const result = await contract.methods[method](purchaseHash)
        .send({
          from: account.data
        })

      return result
    } catch(e) {
      throw new Error(e.message)
    }
  }

  const activatePurchase = async purchaseHash => {
    withToast(changePurchaseState(purchaseHash, "activatePurchase"))
  }

  const deactivatePurchase = async purchaseHash => {
    withToast(changePurchaseState(purchaseHash, "deactivatePurchase"))
  }

  const searchPurchase = async hash => {
    const re = /[0-9A-Fa-f]{6}/g;

    if(hash && hash.length === 66 && re.test(hash)) {
      const purchase = await contract.methods.getPurchaseByHash(hash).call()

      if (purchase.owner !== "0x0000000000000000000000000000000000000000") {
        const normalized = normalizeOwnedPurchase(web3)({hash}, purchase)
        setSearchedPurchase(normalized)
        return
      }
    }

    setSearchedPurchase(null)
  }

  const renderCard = (purchase, isSearched) => {
    return (
      <ManagedPurchaseCard
        key={purchase.ownedPurchaseId}
        isSearched={isSearched}
        purchase={purchase}
      >
        <VerificationInput
          onVerify={email => {
            verifyPurchase(email, {
              hash: purchase.hash,
              proof: purchase.proof
            })
          }}
        />
        { proofedOwnership[purchase.hash] &&
          <div className="mt-2">
            <Message>
              Verified!
            </Message>
          </div>
        }
        { proofedOwnership[purchase.hash] === false &&
          <div className="mt-2">
            <Message type="danger">
              Wrong Proof!
            </Message>
          </div>
        }
        { purchase.state === "purchased" &&
          <div className="mt-2">
            <Button
              onClick={() => activatePurchase(purchase.hash)}
              variant="green">
              Activate
            </Button>
            <Button
              onClick={() => deactivatePurchase(purchase.hash)}
              variant="red">
              Deactivate
            </Button>
          </div>
        }
      </ManagedPurchaseCard>
    )
  }

  if (!account.isAdmin) {
    return null
  }

  const filteredPurchases = managedPurchases.data
    ?.filter((purchase) => {
      if (filters.state === "all") {
        return true
      }

      return purchase.state === filters.state
    })
    .map(purchase => renderCard(purchase) )

  return (
    <>
      <MarketHeader />
      <PurchaseFilter
        onFilterSelect={(value) => setFilters({state: value})}
        onSearchSubmit={searchPurchase}
      />
      <section className="grid grid-cols-1">
        { searchedPurchase &&
          <div>
            <h1 className="text-2xl font-bold p-5">Search</h1>
            { renderCard(searchedPurchase, true) }
          </div>
        }
        <h1 className="text-2xl font-bold p-5">All Purchases</h1>
        { filteredPurchases }
        { filteredPurchases?.length === 0 &&
          <Message type="warning">
            No purchases to display
          </Message>
        }
      </section>
    </>
  )
}

ManagedPurchases.Layout = BaseLayout
