'use client'

import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function AuthStatus() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return (
      <Link href="/dashboard">
        <Button variant="default">
          Dashboard
        </Button>
      </Link>
    )
  }

  return (
    <>
      <Link href="/sign-in">
        <Button variant="ghost">
          Sign In
        </Button>
      </Link>
      <Link href="/sign-up">
        <Button variant="default">
          Sign Up
        </Button>
      </Link>
    </>
  )
}