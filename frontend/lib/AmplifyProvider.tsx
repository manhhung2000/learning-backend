'use client'

import { Amplify } from 'aws-amplify'
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito'
import { CookieStorage } from 'aws-amplify/utils'

if (typeof window !== 'undefined') {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
        userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      },
    },
  })
  cognitoUserPoolsTokenProvider.setKeyValueStorage(
    new CookieStorage({
      domain: window.location.hostname,
      path: '/',
      secure: false,
      sameSite: 'lax',
    }),
  )
}

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
