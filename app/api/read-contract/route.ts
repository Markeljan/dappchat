import { kv } from '@vercel/kv';
import { Configuration, OpenAIApi } from 'openai-edge';

import { auth } from '@/auth';
import { nanoid } from '@/lib/utils';
import { createPublicClient, http } from 'viem';
import { gnosis } from 'viem/chains';
import { ReadContractRequestItem, ReadContractResponseItem } from '@/lib/types';
import fetchAbi from '@/lib/fetchAbi';

export const runtime = 'edge';

const QUICKNODE_API_KEY = process.env.NEXT_PUBLIC_QUICKNODE_API_KEY || '';

export async function POST(req: Request) {
  const json = await req.json();
  const { requests }: { requests: ReadContractRequestItem[] } = json;
  const session = await auth();

  if (session == null) {
    return new Response('Unauthorized', { status: 401 });
  }

  const publicClient = createPublicClient({
    chain: gnosis,
    transport: QUICKNODE_API_KEY ? http(`https://wiser-wispy-forest.xdai.quiknode.pro/${QUICKNODE_API_KEY}`) : http(),
  });

  // Create an object to store ABIs
  const ABIs: { [key: string]: any } = {};

  // Find unique contract addresses
  const uniqueAddresses = Array.from(new Set(requests.map(request => request.address)));

  // Fetch ABIs for each unique contract
  await Promise.all(uniqueAddresses.map(async (address) => {
    ABIs[address] = JSON.parse(await fetchAbi(address));
  }));

  // Read contract with corresponding ABIs
  const responses = await Promise.allSettled(
    requests.map(async (request) => {
      try {
        const data = await publicClient.readContract({
          address: request.address,
          abi: ABIs[request.address],
          functionName: request.functionName,
          args: request.functionArgs,
        });
        return { status: 'fulfilled', value: data } as PromiseFulfilledResult<any>;
      } catch (error) {
        return { status: 'rejected', reason: (error as Error).message } as PromiseRejectedResult;
      }
    }),
  );

  const responsesArray = responses.map((response, index) => {
    if (response.status === 'rejected') {
      console.error(`Request ${index + 1} failed with error: ${response.reason}`);
      return null;  // or handle this case differently based on your requirements
    }
    console.log("responses success", { data: response.value })
    return { status: 'success', data: response.value } as ReadContractResponseItem;
  });

  const responseData = responsesArray
    .filter(response => response !== null)
    .map(response => {
      if (response?.data && typeof response.data.value === 'bigint') {
        return {
          ...response,
          data: {
            ...response.data,
            value: response.data.value.toString(),
          }
        };
      } else {
        return response;
      }
    });
  return new Response(JSON.stringify(responseData));

}
