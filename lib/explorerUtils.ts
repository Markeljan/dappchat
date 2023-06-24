import { Chain } from "viem";

export const EXPLORER_CONFIGS: Record<Chain["name"], { url: string, apiKey: string | undefined }> = {
  'Ethereum': {
    url: 'https://api.etherscan.io',
    apiKey: process.env.ETHEREUM_API_KEY,
  },
  'Goerli': {
    url: 'https://api-goerli.etherscan.io',
    apiKey: process.env.ETHEREUM_API_KEY,
  },
  'Sepolia': {
    url: 'https://api-sepolia.etherscan.io',
    apiKey: process.env.ETHEREUM_API_KEY,
  },
  'Arbitrum One': {
    url: 'https://api.arbiscan.io',
    apiKey: process.env.ARBITRUM_API_KEY,
  },
  'Arbitrum Goerli': {
    url: 'https://api-goerli.arbiscan.io',
    apiKey: process.env.ARBITRUM_API_KEY,
  },
  'Polygon Mainnet': {
    url: 'https://api.polygonscan.com',
    apiKey: process.env.POLYGON_API_KEY,
  },
  'Mumbai': {
    url: 'https://api-testnet.polygonscan.com',
    apiKey: process.env.POLYGON_API_KEY,
  },
  'Polygon zkEVM': {
    url: 'https://api-zkevm.polygonscan.com',
    apiKey: process.env.POLYGON_ZKEVM_API_KEY,
  },
  'Polygon zkEVM Testnet': {
    url: 'https://api-testnet-zkevm.polygonscan.com',
    apiKey: process.env.POLYGON_ZKEVM_API_KEY,
  },
  'Optimism': {
    url: 'https://api-optimistic.etherscan.io',
    apiKey: process.env.OPTIMISM_API_KEY,
  },
  'Optimism Goerli Testnet': {
    url: 'https://api-goerli.optimistic.etherscan.io',
    apiKey: process.env.OPTIMISM_API_KEY,
  },
  'Gnosis': {
    url: 'https://api.gnosisscan.io',
    apiKey: process.env.GNOSIS_API_KEY,
  },
}