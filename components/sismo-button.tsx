"use client"

import { SismoConnectButton } from '@sismo-core/sismo-connect-react'
import { AuthType, ClaimType, SismoConnectConfig, SismoConnectResponse } from '@sismo-core/sismo-connect-react'
import { signIn } from 'next-auth/react'

const sismoConnectConfig: SismoConnectConfig = {
  appId: '0xfe303d869ab446ebc2f0d378e466a9a8',
  vault: {
    impersonate: ['dhadrien.sismo.eth', 'github:dhadrien', 'twitter:dhadrien_']
  }
}

const SismoButton = () => {

  const handleSismoConnectResponse = async (response: SismoConnectResponse) => {
    try {
      // Use the fetch API to post the response to your API route
      const res = await fetch('/api/sismo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(response),
      })

      // Check if the request was successful
      if (res.ok) {
        const user = await res.json()
        // Update the session with the user information
        await signIn('sismo', { user });
      } else {
        // Handle any errors here
        const errorData = await res.json()
        console.error('Sismo Connect Error:', errorData)
      }
    } catch (error) {
      console.error('Failed to handle Sismo Connect response:', error)
    } 
  }

  return (
    <SismoConnectButton
      config={sismoConnectConfig}
      auths={[
        { authType: AuthType.VAULT },
        { authType: AuthType.EVM_ACCOUNT }
      ]}
      claims={[
        {
          groupId: '0x1cde61966decb8600dfd0749bd371f12',
          claimType: ClaimType.GTE,
          value: 15
        }
      ]}
      onResponse={handleSismoConnectResponse}
    />
  )
}

export default SismoButton
