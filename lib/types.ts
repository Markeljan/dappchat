import { Message } from '@/ai-sdk/packages/core/shared/types'

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export type ReadContractRequestItem = {
  address: `0x${string}`;
  functionName: string;
  functionArgs: Array<string | string[]>;
}

export interface ReadContractResponseItem {
  status: string;
  data: any;
}

