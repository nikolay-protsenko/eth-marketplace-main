import { useAccount, useOwnedPurchase } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Message, Modal } from "@components/ui/common";
import {
  PurchaseHero,
  Keypoints
} from "@components/ui/purchase";
import { BaseLayout } from "@components/ui/layout";
import { getAllPurchases } from "@content/purchases/fetcher";

export default function Purchase({purchase}) {
  const { isLoading } = useWeb3()
  const { account } = useAccount()
  const { ownedPurchase } = useOwnedPurchase(purchase, account.data)
  const purchaseState = ownedPurchase.data?.state
  // const purchaseState = "deactivated"

  const isLocked =
    !purchaseState ||
    purchaseState === "purchased" ||
    purchaseState === "deactivated"

  return (
    <>
      <div className="py-4">
        <PurchaseHero
          hasOwner={!!ownedPurchase.data}
          title={purchase.title}
          description={purchase.description}
          image={purchase.coverImage}
        />
      </div>
      <Keypoints
        points={purchase.wsl}
      />
      { purchaseState &&
        <div className="max-w-5xl mx-auto">
          { purchaseState === "purchased" &&
            <Message type="warning">
              Product is purchased and waiting for the activation. Process can take up to 24 hours.
              <i className="block font-normal">In case of any questions, please contact test@mail.com</i>
            </Message>
          }
          { purchaseState === "activated" &&
            <Message type="success">
              item purchased!!
            </Message>
          }
          { purchaseState === "deactivated" &&
            <Message type="danger">
              Order has been deactivated, due the incorrect purchase data.
              <i className="block font-normal">Please contact test@mail.com</i>
            </Message>
          }
        </div>
      }
      <Modal />
    </>
  )
}

export function getStaticPaths() {
  const { data } = getAllPurchases()

  return {
    paths: data.map(c => ({
      params: {
        slug: c.slug
      }
    })),
    fallback: false
  }
}


export function getStaticProps({params}) {
  const { data } = getAllPurchases()
  const purchase = data.filter(c => c.slug === params.slug)[0]

  return {
    props: {
      purchase
    }
  }
}

Purchase.Layout = BaseLayout
