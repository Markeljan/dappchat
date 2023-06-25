import { kv } from '@vercel/kv';
import { Configuration, OpenAIApi } from 'openai-edge';

import { auth } from '@/auth';
import { nanoid } from '@/lib/utils';
import {
  OpenAIStream,
  StreamingTextResponse
} from '@/ai-sdk/packages/core/streams';

export const runtime = 'edge';

export async function POST(req: Request) {
  const json = await req.json();
  const { messages, functions, function_call } = json;
  const session = await auth();

  if (session == null) {
    return new Response('Unauthorized', { status: 401 });
  }


  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });

  const openai = new OpenAIApi(configuration);

  // Ask OpenAI for a streaming chat completion given the prompt
  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-0613',
    stream: true,
    messages,
    functions,
    function_call
  });

  console.log('Response:', res);

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      console.log('Completion:', completion);

      const title = json.messages[0].content.substring(0, 100);
      const userId = session?.user.id;

      if (userId) {
        const id = json.id ?? nanoid();
        const createdAt = Date.now();
        const path = `/chat/${id}`;
        const payload = {
          id,
          title,
          userId,
          createdAt,
          path,
          messages: [
            ...messages,
            {
              content: completion,
              role: 'assistant'
            }
          ]
        };

        console.log('Payload:', payload);

        await kv.hmset(`chat:${id}`, payload);
        await kv.zadd(`user:chat:${userId}`, {
          score: createdAt,
          member: `chat:${id}`
        });
      }
    }
  });

  return new StreamingTextResponse(stream);
}