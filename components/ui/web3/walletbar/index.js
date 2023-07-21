
import { useWalletInfo } from "@components/hooks/web3"
import { useWeb3 } from "@components/providers"


export default function WalletBar() {
  const { requireInstall } = useWeb3()
  const { account, network } = useWalletInfo()

  return (
    <section className="text-white bg-blue-600 rounded-lg">
      <div className="p-8">
        <h1 className="text-base xs:text-xl break-words">Hello, {account.data}</h1>
        
        <div className="flex justify-between items-center">
          <div className="sm:flex sm:justify-center lg:justify-start">
            <></>
          </div>
          <div>
            { network.hasInitialResponse && !network.isSupported &&
              <div className="bg-red-400 p-4 rounded-lg">
                <div>Connected to wrong network</div>
                <div>
                  Connect to: {` `}
                  <strong className="text-2xl">
                    {network.target}
                  </strong>
                </div>
              </div>
            }
            { requireInstall &&
              <div className="bg-yellow-500 p-4 rounded-lg">
                Cannot connect to network. Please install Metamask.
              </div>
            }
            { network.data &&
              <div>
                <span>Currently on </span>
                <strong className="text-2xl">{network.data}</strong>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  )
}
