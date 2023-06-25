import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@/components/ui/icons'
import { UseChatHelpers } from '@/ai-sdk/packages/core/react'

const exampleMessages = [
  {
    heading: "ELI5 the smart contract at this address",
    message: "What does this contract do? 0x0f38f41cd7ef4793412c58263c7dc54dbd807f73 \n"
  },
  {
    heading: "Read the balance of this address for this token",
    message: "What is the balance of 0x0b01dddd89a019ec63aa36f75549723ea04e0f2ffa6b067316ea13626ded13a5 for account 0x68E08371d1D0311b7c81961c431D71F71a94dd1a? \n"
  },
  {
    heading: "Fetch multiple token values at once",
    message: "Show me the token uris for tokens 4-8 for contract 0x0f38f41cD7eF4793412C58263C7dC54dbD807f73 \n"
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          {"👋 Hi welcome to dapp chat, I'm Lexi your trusty Web3 AI assistant"}
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          {"I'm here to make your Web3 experience seamless and exciting! Whether"}
          it&apos;s swapping tokens, checking your balance or understanding your
          transactions. {"I've got you covered!"}{' '}
        </p>
        <p className="leading-normal text-muted-foreground">
          {"We can start chatting here or try the following examples:"}
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
