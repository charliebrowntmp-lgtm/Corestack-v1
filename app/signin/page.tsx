import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import AuthForm from '@/components/auth/AuthForm'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Corestack account to apply for jobs and manage your listings.',
}

export default function SignInPage() {
  return (
    <div className="px-6 py-16">
      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl font-bold mb-2">Sign In</h1>
        <p className="text-sm text-black/50 mb-8">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="text-black underline hover:text-[#3ecf8e] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
          >
            Create one
          </Link>
        </p>
        <Suspense fallback={null}>
          <AuthForm mode="signin" />
        </Suspense>
      </div>
    </div>
  )
}
