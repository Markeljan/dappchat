import { kv } from '@vercel/kv'
import { Configuration, OpenAIApi } from 'openai-edge'

import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import {
  OpenAIStream,
  StreamingTextResponse
} from '@/ai-sdk/packages/core/streams'
import { createPublicClient, http } from 'viem'
import { gnosis } from 'viem/chains'

export const runtime = 'edge'

const QUICKNODE_API_KEY = process.env.NEXT_PUBLIC_QUICKNODE_API_KEY || ''

export async function POST(req: Request) {
  const json = await req.json()
  const { requests } = json
  const session = await auth()

  if (process.env.VERCEL_ENV !== 'preview') {
    if (session == null) {
      return new Response('Unauthorized', { status: 401 })
    }
  }

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  })

  const openai = new OpenAIApi(configuration)

  const publicClient = createPublicClient({
    chain: gnosis,
    transport: QUICKNODE_API_KEY ? http(`https://wiser-wispy-forest.xdai.quiknode.pro/${QUICKNODE_API_KEY}`) : http()
  })

  // const ABI = await fetchAbi(viemChain, requests[0].address);

  // const responses = await Promise.allSettled(
  //     requests.map(async (request) => {
  //         try {
  //             const data = await publicClient.readContract({
  //                 address: request.address,
  //                 abi: ABI,
  //                 functionName: request.functionName,
  //                 args: request.functionArgs
  //             });
  //             return { status: 'fulfilled', value: data };
  //         } catch (error) {
  //             return { status: 'rejected', reason: (error as Error).message };
  //         }
  //     })
  // );

  // const responsesArray = responses.map((response, index) => {
  //     if (response.status === 'rejected') {
  //         console.error(`Request ${index + 1} failed with error: ${response.reason}`);
  //         return null;  // or handle this case differently based on your requirements
  //     }
  //     return { status: 'success', data: response.value };
  // });

  // console.log(responsesArray)

  // const responseData: ReadContractResponse = responsesArray.filter(response => response !== null) as ReadContractResponse;

  // return new Response(jsonStringifyBigInt(responseData), {
  //     headers: {
  //         "content-type": "application/json",
  //     },
  // });

  // // Ask OpenAI for a streaming chat completion given the prompt
  // const res = await openai.createChatCompletion({
  //     model: 'gpt-3.5-turbo-0613',
  //     stream: true,
  //     messages,
  //     functions,
  //     function_call
  // });

  // const stream = OpenAIStream(res, {
  //     async onCompletion(completion) {
  //         const title = json.messages[0].content.substring(0, 100)
  //         const userId = session?.user.id
  //         if (userId) {
  //             const id = json.id ?? nanoid()
  //             const createdAt = Date.now()
  //             const path = `/chat/${id}`
  //             const payload = {
  //                 id,
  //                 title,
  //                 userId,
  //                 createdAt,
  //                 path,
  //                 messages: [
  //                     ...messages,
  //                     {
  //                         content: completion,
  //                         role: 'assistant'
  //                     }
  //                 ]
  //             }
  //             await kv.hmset(`chat:${id}`, payload)
  //             await kv.zadd(`user:chat:${userId}`, {
  //                 score: createdAt,
  //                 member: `chat:${id}`
  //             })
  //         }
  //     }
  // })

  // return new StreamingTextResponse(stream)
}
