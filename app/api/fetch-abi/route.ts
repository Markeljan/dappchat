import { EXPLORER_CONFIGS } from "@/lib/explorerUtils";
import { Chain } from 'viem';

export async function POST(req: Request) {
    const body = await req.json();
    const { chain, address }: { chain: Chain, address: `0x${string}` } = body;

    const ABI = await fetchAbi(chain.name, address as `0x${string}`);
    return new Response(JSON.stringify(ABI));
}

const fetchAbi = async (chainName: Chain['name'], contractAddress: `0x${string}`): Promise<any> => {
    const { url, apiKey } = EXPLORER_CONFIGS[chainName];
    const explorerApiUrl = `${url}/api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`;

    const response = await fetch(explorerApiUrl);
    const data = await response.json();
    return data.result
};
