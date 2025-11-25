'use client'
import { useQuery, useMutation } from 'convex/react'
import { api, useAuth } from '@/lib/convex'
import { Id } from '../convex/_generated/dataModel'

export default function LikeButton({ contentId, contentType }: { contentId: string; contentType: 'artwork' | 'review' }) {
  const { token } = useAuth()
  const likeStatus = useQuery(api.likes.getLikeStatus, { token: token ?? undefined, contentId })
  const toggleLike = useMutation(api.likes.toggle)

  const count = likeStatus?.count ?? 0
  const liked = likeStatus?.liked ?? false

  const onToggle = async () => {
    await toggleLike({ token: token ?? undefined, contentId, contentType })
  }

  return (
    <button 
      aria-label={liked ? 'Unlike' : 'Like'} 
      onClick={onToggle}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 transition-colors ${
        liked 
          ? 'bg-red-500 text-white' 
          : 'bg-inkYellow text-inkBlack hover:bg-yellow-400'
      }`}
    >
      <span>{liked ? '❤️' : '🤍'}</span>
      <span>{count}</span>
    </button>
  )
}
