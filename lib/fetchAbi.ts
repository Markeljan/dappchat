import { EXPLORER_CONFIGS } from "./explorerUtils"

export const runtime = 'edge';

const fetchAbi = async (
    contractAddress: `0x${string}`
  ): Promise<any> => {
    const { url, apiKey } = EXPLORER_CONFIGS['Gnosis']
    const explorerApiUrl = `${url}/api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`
  
    const response = await fetch(explorerApiUrl)
    const data = await response.json()
    return data.result
  }

export default fetchAbi;