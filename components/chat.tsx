'use client'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Message } from '@/ai-sdk/packages/core/shared/types'
import {
  FunctionCallHandler,
  OpenAIChatRequest,
  useChat
} from '@/ai-sdk/packages/core/react'
import {
  ChatCompletionFunctions,
  ChatCompletionRequestMessageFunctionCall
} from 'openai-edge'
import { nanoid } from 'nanoid'
import fetchAbi from '@/lib/route-helpers/use-route-fetch-abi'
import readContract from '@/lib/route-helpers/use-route-read-contract'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}
const functionCallHandler: FunctionCallHandler = async (
  functionCall: ChatCompletionRequestMessageFunctionCall,
  chatRequest: OpenAIChatRequest
) => {
  if (functionCall.arguments != null) {
    const parsedFunctionCallArguments = JSON.parse(functionCall.arguments)

    switch (functionCall.name) {
      case 'fetch_abi':
        try {
          const abi = await fetchAbi(parsedFunctionCallArguments.address);
          return Promise.resolve({
            ...chatRequest,
            messages: [
              ...chatRequest.messages,
              {
                name: 'fetch_abi',
                id: nanoid(),
                role: 'function',
                content: abi
              }
            ]
          });
        } catch (error: any) {
          return Promise.resolve({
            ...chatRequest,
            messages: [
              ...chatRequest.messages,
              {
                name: 'fetch_abi',
                id: nanoid(),
                role: 'function',
                content: error.message
              }
            ]
          });
          // Handle error as needed, maybe add an error message to the chat?
        }

      case 'read_contract':
        try {
          const contractData = await readContract(parsedFunctionCallArguments.requests);
          console.log("CONTRACT_DATA", contractData);
          return Promise.resolve({
            ...chatRequest,
            messages: [
              ...chatRequest.messages,
              {
                name: 'read_contract',
                id: nanoid(),
                role: 'function',
                content: contractData
              }
            ]
          });
        } catch (error: any) {
          return Promise.resolve({
            ...chatRequest,
            messages: [
              ...chatRequest.messages,
              {
                name: 'read_contract',
                id: nanoid(),
                role: 'function',
                content: error.message
              }
            ]
          });
        }
      // handle other function names as needed

      default:
        return Promise.resolve(chatRequest);
    }
  }

  return Promise.resolve(chatRequest);
  // No arguments provided, handle as needed
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      functionCallHandler,
      initialMessages,
      id,
      body: {
        id
      }
    })
  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />
    </>
  )
}
