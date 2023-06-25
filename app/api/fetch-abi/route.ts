import { EXPLORER_CONFIGS } from '@/lib/explorerUtils'

export const runtime = 'edge'

export async function POST(req: Request) {
  const body = await req.json()
  const { address }: { address: `0x${string}` } = body

  const ABI = await fetchAbi(address as `0x${string}`)
  return new Response(JSON.stringify(ABI))
}

const fetchAbi = async (
  contractAddress: `0x${string}`
): Promise<any> => {
  const { url, apiKey } = EXPLORER_CONFIGS['Gnosis']
  const explorerApiUrl = `${url}/api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`

  const response = await fetch(explorerApiUrl)
  const data = await response.json()
  return data.result
}
