'use client'

import { FC, PropsWithChildren } from 'react'
import { gnosis } from 'viem/chains'
import { createPublicClient, http } from 'viem'
import {
  WagmiConfig,
  createConfig,
  configureChains,
  ChainProviderFn
} from 'wagmi'
import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { SessionProvider } from 'next-auth/react'

const QUICKNODE_API_KEY = process.env.NEXT_PUBLIC_QUICKNODE_API_KEY || ''
const WALLETCONNECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_ID || ''

// declare function configureChains<TChain extends Chain = Chain>(defaultChains: TChain[], providers: ChainProviderFn<TChain>[], { batch, pollingInterval, rank, retryCount, retryDelay, stallTimeout, }?: ConfigureChainsConfig): {
//     readonly chains: TChain[];
//     readonly publicClient: ({ chainId }: {
//         chainId?: number | undefined;
//     }) => PublicClient<FallbackTransport>;
//     readonly webSocketPublicClient: ({ chainId }: {
//         chainId?: number | undefined;
//     }) => WebSocketPublicClient<FallbackTransport> | undefined;
// };

const { chains, publicClient } = configureChains(
  [gnosis],
  [
    jsonRpcProvider({
      rpc: chain => {
        return {
          http: `https://wiser-wispy-forest.xdai.quiknode.pro/${QUICKNODE_API_KEY}`,
          webSocket: `wss://wiser-wispy-forest.xdai.quiknode.pro/${QUICKNODE_API_KEY}`
        }
      }
    }),
    publicProvider()
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'Dapp Chat',
  projectId: WALLETCONNECT_ID,
  chains
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

const ClientLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <SessionProvider>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
      </WagmiConfig>
    </SessionProvider>
  )
}

export default ClientLayout
