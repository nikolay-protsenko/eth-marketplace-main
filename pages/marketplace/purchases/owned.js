

import { useAccount, useOwnedPurchases } from "@components/hooks/web3"
import { Button, Message } from "@components/ui/common"
import { OwnedPurchaseCard } from "@components/ui/purchase"
import { BaseLayout } from "@components/ui/layout"
import { MarketHeader } from "@components/ui/marketplace"
import { getAllPurchases } from "@content/purchases/fetcher"
import { useRouter } from "next/router"
import Link from "next/link"
import { useWeb3 } from "@components/providers"

export default function OwnedPurchases({purchases}) {
  const router = useRouter()
  const { requireInstall } = useWeb3()
  const { account } = useAccount()
  const { ownedPurchases } = useOwnedPurchases(purchases, account.data)

  return (
    <>
      <MarketHeader />
      <section className="grid grid-cols-1">
        { ownedPurchases.isEmpty &&
          <div className="w-1/2">
            <Message type="warning">
              <div>You don&apos;t own any goods</div>
              <Link href="/marketplace">
                <a className="font-normal hover:underline">
                  <i>Purchase goods</i>
                </a>
              </Link>
            </Message>
          </div>
        }
        { account.isEmpty &&
          <div className="w-1/2">
            <Message type="warning">
              <div>Please connect to Metamask</div>
            </Message>
          </div>
        }
        { requireInstall &&
          <div className="w-1/2">
            <Message type="warning">
              <div>Please install Metamask</div>
            </Message>
          </div>
        }
        { ownedPurchases.data?.map(purchase =>
          <OwnedPurchaseCard
            key={purchase.id}
            purchase={purchase}
          >
            <Button
              onClick={() => router.push(`/purchases/${purchase.slug}`)}
            >
              Details
            </Button>
          </OwnedPurchaseCard>
        )}
      </section>
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

OwnedPurchases.Layout = BaseLayout
