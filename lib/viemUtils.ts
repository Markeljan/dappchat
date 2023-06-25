import * as all from 'viem/chains'
import { Chain } from 'viem'
import stringSimilarity from 'string-similarity'

const { ...chains } = all

/**
 * Gets the chain object for the given chain id.
 * @param chainId - Chain id of the target EVM chain.
 * @returns Viem's chain object.
 */
export function getChainById(chainId: number) {
  for (const chain of Object.values(chains)) {
    if (chain.id === chainId) {
      return chain
    }
  }

  throw new Error(`Chain with id ${chainId} not found`)
}

export function getChainByName(name: string) {
  const lowerCaseName = name.toLowerCase()
  let chainsArray: Chain[] = Object.values(chains)

  // First, look for an exact match (case-insensitive)
  for (const chain of chainsArray) {
    if (chain.name.toLowerCase() === lowerCaseName) {
      return chain
    }
  }

  // If no exact match is found, use string-similarity to find the closest match
  const {
    bestMatch: { target }
  } = stringSimilarity.findBestMatch(
    lowerCaseName,
    chainsArray.map(chain => chain.name.toLowerCase())
  )
  const closestChain = chainsArray.find(
    chain => chain.name.toLowerCase() === target
  )

  if (closestChain) {
    return closestChain
  } else {
    throw new Error(`Chain with name ${name} not found`)
  }
}
