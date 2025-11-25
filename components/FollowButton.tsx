'use client'
import { useQuery, useMutation } from 'convex/react'
import { api, useAuth } from '@/lib/convex'
import { Id } from '../convex/_generated/dataModel'

export default function FollowButton({ userId }: { userId: Id<"users"> }) {
  const { user, token } = useAuth()
  const followStatus = useQuery(api.follows.getFollowStatus, { token: token ?? undefined, userId })
  const toggleFollow = useMutation(api.follows.toggle)

  const following = followStatus?.following ?? false

  const handleToggle = async () => {
    if (!token) return
    await toggleFollow({ token, userId })
  }

  if (!user) {
    return null
  }

  return (
    <button
      onClick={handleToggle}
      className={`rounded-md px-6 py-2 text-sm font-medium transition-colors ${
        following
          ? 'bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600'
          : 'bg-inkPink text-white hover:bg-pink-600'
      }`}
    >
      {following ? 'Following' : 'Follow'}
    </button>
  )
}
