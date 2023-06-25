import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'
import { UseChatHelpers } from '@/ai-sdk/packages/core/react'

const exampleMessages = [
  {
    heading: 'swap 100 usdc for eth within the chat app',
    message: `swap 100 usdc for eth on gnosis using sushiswap \n`
  },
  {
    heading: 'Send .001 eth to vitalik.eth',
    message: 'Send .001 eth to "vitalik.eth" on gnosis chain \n'
  },
  {
    heading: 'Get my last transaction on gnosis',
    message: `Get the details of my last transaction gnosis chain \n`
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          👋 Hi welcome to dapp chat, I'm Lexi your trusty Web3 AI assistant
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          I'm here to make your Web3 experience seamless and exciting! Whether
          it's swapping tokens, checking your balance or understanding your
          transactions. I've got you covered!{' '}
        </p>
        <p className="leading-normal text-muted-foreground">
          We can start chatting here or try the following examples:
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
