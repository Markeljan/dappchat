// fetchAbi.ts
import { Chain } from 'viem';

export const fetchAbi = async (chain: Chain, address: string) => {
  const response = await fetch("/api/fetch-abi", {
    method: 'POST',
    body: JSON.stringify({
      chain: chain,
      address: address
    })
  });

  if (!response.ok) {
    throw new Error(`Error fetching ABI: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};
