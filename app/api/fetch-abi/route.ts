import fetchAbi from '@/lib/fetchAbi'

export const runtime = 'edge'

export async function POST(req: Request) {
  const body = await req.json()
  const { address }: { address: `0x${string}` } = body

  const ABI = await fetchAbi(address as `0x${string}`)
  return new Response(JSON.stringify(ABI))
}
