import React from 'react'

import { cn } from '@/lib/utils'
import { ExternalLink } from '@/components/external-link'

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-muted-foreground',
        className
      )}
      {...props}
    >
      Built on <ExternalLink href="https://gnosis.io">Gnosis</ExternalLink> at{' '}
      <ExternalLink href="https://ethglobal.com/events/waterloo2023">
        ETHGlobal Waterloo
      </ExternalLink>
      .
    </p>
  )
}
