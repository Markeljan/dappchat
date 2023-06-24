"use client"

import { WagmiConfig, createConfig } from 'wagmi'
import { gnosis } from 'viem/chains'
import { createPublicClient, http } from 'viem'
import { FC, PropsWithChildren } from 'react'
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const QUICKNODE_API_KEY = process.env.NEXT_PUBLIC_QUICKNODE_API_KEY || ''
const WALLETCONNECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_ID || ''

const config = createConfig(getDefaultConfig({
    autoConnect: true,
    publicClient: createPublicClient({
        chain: gnosis,
        transport: QUICKNODE_API_KEY ? http(`https://wiser-wispy-forest.xdai.quiknode.pro/${QUICKNODE_API_KEY}`) : http()
    }),
    walletConnectProjectId: WALLETCONNECT_ID,
    chains: [gnosis],
    appName: "dappchat",
    appDescription: "Easily interact with the Gnosis Dapp ecosystem.",
    appUrl: "https://www.dappchat.xyz",
    appIcon: "https://www.dappchat.xyz/logo.png",

}))


const ClientLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
    return (
        <WagmiConfig config={config}>
            <ConnectKitProvider>
                {children}
            </ConnectKitProvider>
        </WagmiConfig>
    )
}

export default ClientLayout