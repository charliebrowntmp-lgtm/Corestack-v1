'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Profile {
  id: string
  full_name: string | null
  title: string | null
  location: string | null
  bio: string | null
  open_to_work: boolean | null
  profile_visible: boolean | null
}

interface Props {
  profile: Profile
}

export default function ProfileForm({ profile }: Props) {
  const [fullName, setFullName] = useState(profile.full_name ?? '')
  const [title, setTitle] = useState(profile.title ?? '')
  const [location, setLocation] = useState(profile.location ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [openToWork, setOpenToWork] = useState(profile.open_to_work ?? false)
  const [profileVisible, setProfileVisible] = useState(profile.profile_visible ?? true)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSaved(false)

    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName || null,
        title: title || null,
        location: location || null,
        bio: bio || null,
        open_to_work: openToWork,
        profile_visible: profileVisible,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-lg" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="full-name" className="text-sm font-medium">
          Full name
        </label>
        <input
          id="full-name"
          type="text"
          autoComplete="name"
          placeholder="Jane Smith"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="border border-black px-3 py-2.5 text-sm focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none placeholder:text-black/40"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="prof-title" className="text-sm font-medium">
          Professional title
        </label>
        <input
          id="prof-title"
          type="text"
          placeholder="Senior Commissioning Engineer"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-black px-3 py-2.5 text-sm focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none placeholder:text-black/40"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="location" className="text-sm font-medium">
          Location
        </label>
        <input
          id="location"
          type="text"
          autoComplete="address-level2"
          placeholder="Ashburn, VA"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border border-black px-3 py-2.5 text-sm focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none placeholder:text-black/40"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="bio" className="text-sm font-medium">
          Bio
        </label>
        <textarea
          id="bio"
          rows={4}
          placeholder="A short summary of your background and what you're looking for…"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="border border-black px-3 py-2.5 text-sm focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none placeholder:text-black/40 resize-none"
        />
      </div>

      <div className="flex flex-col gap-3 border border-black px-4 py-4 bg-white/60">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={openToWork}
            onChange={(e) => setOpenToWork(e.target.checked)}
            className="w-4 h-4 border border-black accent-[#3ecf8e] cursor-pointer flex-shrink-0"
          />
          <span className="text-sm font-medium">Open to work</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={profileVisible}
            onChange={(e) => setProfileVisible(e.target.checked)}
            className="w-4 h-4 border border-black accent-[#3ecf8e] cursor-pointer flex-shrink-0"
          />
          <span className="text-sm font-medium">Public profile</span>
        </label>
      </div>

      {error && (
        <p
          role="alert"
          aria-live="polite"
          className="text-sm text-red-600 border border-red-300 bg-red-50 px-3 py-2"
        >
          {error}
        </p>
      )}

      {saved && (
        <p
          role="status"
          aria-live="polite"
          className="text-sm font-medium text-[#3ecf8e] border border-[#3ecf8e] bg-[#3ecf8e]/10 px-3 py-2"
        >
          Profile saved
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2.5 text-sm font-medium transition-colors duration-150 hover:bg-[#3ecf8e] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none w-fit"
      >
        {loading ? 'Saving…' : 'Save Profile'}
      </button>
    </form>
  )
}
