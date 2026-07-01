import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import SignOutTile from './SignOutTile'

const navLinks = [
  { href: '/jobs', label: 'Jobs' },
  { href: '/news', label: 'News' },
  { href: '/resources', label: 'Resources' },
  { href: '/dashboard', label: 'Dashboard' },
]

export default async function MosaicNav() {
  let user = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Supabase unavailable — render nav without auth state
  }

  return (
    <nav
      className="flex items-stretch h-12 border-b border-black overflow-x-auto"
      aria-label="Main navigation"
    >
      {/* Logo tile */}
      <Link
        href="/"
        className="flex items-center px-4 border-r border-black bg-white flex-shrink-0 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-inset outline-none"
        aria-label="Corestack home"
      >
        <Image
          src="/corestack-logo.webp"
          alt="Corestack"
          width={120}
          height={28}
          className="h-7 w-auto object-contain"
          priority
        />
      </Link>

      {/* Spacer pushes nav links to the right */}
      <div className="flex-1" />

      {/* Nav links — right-aligned */}
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="flex items-center px-4 text-sm font-medium border-l border-black transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none whitespace-nowrap"
        >
          {link.label}
        </Link>
      ))}

      {/* Auth tiles */}
      {user ? (
        <SignOutTile />
      ) : (
        <Link
          href="/signin"
          className="flex items-center px-4 text-sm font-medium border-l border-black transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none whitespace-nowrap"
        >
          Sign In
        </Link>
      )}

      {/* Post a Job CTA tile */}
      <Link
        href="/post"
        className="flex items-center px-4 text-sm font-medium bg-black text-white border-l border-black transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none whitespace-nowrap"
      >
        Post a Job
      </Link>
    </nav>
  )
}
