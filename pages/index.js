
import { Hero } from "@components/ui/common"
import { PurchaseList, PurchaseCard } from "@components/ui/purchase"
import { BaseLayout } from "@components/ui/layout"
import { getAllPurchases } from "@content/purchases/fetcher"

export default function Home({purchases}) {
  return (
    <>
      <Hero />
      <PurchaseList
        purchases={purchases}
      >
      {purchase =>
        <PurchaseCard
          key={purchase.id}
          purchase={purchase}
        />
      }
      </PurchaseList>
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

Home.Layout = BaseLayout
