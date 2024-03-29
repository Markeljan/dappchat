import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconRefresh, IconStop } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import { UseChatHelpers } from '@/ai-sdk/packages/core/react'
import { ChatCompletionFunctions } from 'openai-edge'

const functions: ChatCompletionFunctions[] = [
  {
    "name": "fetch_abi",
    "description": "Fetch the ABI of a deployed smart contract on the Gnosis blockchain.",
    "parameters": {
      "type": "object",
      "properties": {
        "address": {
          "type": "string",
          "description": "The blockchain address where the smart contract is deployed."
        }
      },
      "required": ["address"]
    }
  },
  {
    "name": "read_contract",
    "description": "Read smart contract data using multiple requests.",
    "parameters": {
      "type": "object",
      "properties": {
        "requests": {
          "type": "array",
          "description": "An array of ReadContractRequestItem objects containing the details of each request.",
          "items": {
            "type": "object",
            "properties": {
              "address": {
                "type": "string",
                "description": "The blockchain address where the smart contract is deployed."
              },
              "functionName": {
                "type": "string",
                "description": "The name of the function in the smart contract to call."
              },
              "functionArgs": {
                "type": "array",
                "description": "The arguments to pass to the function call.",
                "items": {
                  "type": "string" // You may need to adjust this depending on the type of your function arguments
                }
              }
            },
            "required": ["address", "functionName", "functionArgs"]
          }
        }
      },
      "required": ["requests"]
    }
  },
  {
    "name": "write_contract",
    "description": "Write data to a smart contract and trigger a transaction for the user to sign.",
    "parameters": {
      "type": "object",
      "properties": {
        "address": {
          "type": "string",
          "description": "The blockchain address where the smart contract is deployed."
        },
        "functionName": {
          "type": "string",
          "description": "The name of the function in the smart contract to call."
        },
        "functionArgs": {
          "type": "array",
          "description": "The arguments to pass to the function call.",
          "items": {
            "type": "string"
          }
        }
      },
      "required": ["address", "functionName", "functionArgs"]
    }
  }

];


export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | 'append'
    | 'isLoading'
    | 'reload'
    | 'messages'
    | 'stop'
    | 'input'
    | 'setInput'
  > {
  id?: string
}

export function ChatPanel({
  id,
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages
}: ChatPanelProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex h-10 items-center justify-center">
          {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background"
            >
              <IconStop className="mr-2" />
              Stop generating
            </Button>
          ) : (
            messages?.length > 0 && (
              <Button
                variant="outline"
                onClick={() => reload()}
                className="bg-background"
              >
                <IconRefresh className="mr-2" />
                Regenerate response
              </Button>
            )
          )}
        </div>
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            onSubmit={async value => {
              await append(
                {
                  id,
                  content: value,
                  role: 'user'
                },
                functions
              )
            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}
