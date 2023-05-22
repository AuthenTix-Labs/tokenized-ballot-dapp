import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import { AddressProvider } from '../components/context/AddressContext'

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { configureChains, createClient, useAccount, WagmiConfig } from 'wagmi'
import {
  mainnet,
  sepolia,
  // polygon,
  // optimism,
  // arbitrum,
  goerli,
  // polygonMumbai,
  // optimismGoerli,
  // arbitrumGoerli,
  // polygonZkEvm,
  // polygonZkEvmTestnet,
} from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import MainLayout from '../layout/mainLayout'
import { useRouter } from 'next/router'

const { chains, provider } = configureChains(
  [
    mainnet,
    goerli,
    sepolia,
    // polygon,
    // polygonMumbai,
    // optimism,
    // optimismGoerli,
    // arbitrum,
    // arbitrumGoerli,
    // polygonZkEvm,
    // polygonZkEvmTestnet,
  ],
  [infuraProvider({ apiKey: process.env.INFURA_API_KEY }), publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'My Alchemy DApp',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

export { WagmiConfig, RainbowKitProvider }

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      if (!isReconnected) router.reload()
    },
  })
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        modalSize="compact"
        initialChain={process.env.NEXT_PUBLIC_DEFAULT_CHAIN}
        chains={chains}
      >
        <AddressProvider>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </AddressProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default MyApp
