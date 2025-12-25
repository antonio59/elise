'use client'
import { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/lib/convex'

type EngagementButtonsProps = {
  contentId: string
  contentType: 'artwork' | 'review' | 'book'
  showShare?: boolean
}

function getVisitorId(): string {
  if (typeof window === 'undefined') return ''
  
  let visitorId = localStorage.getItem('visitor_id')
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem('visitor_id', visitorId)
  }
  return visitorId
}

export default function EngagementButtons({ 
  contentId, 
  contentType,
  showShare = true 
}: EngagementButtonsProps) {
  const [visitorId, setVisitorId] = useState('')
  const [showShareMenu, setShowShareMenu] = useState(false)
  
  useEffect(() => {
    setVisitorId(getVisitorId())
  }, [])

  const status = useQuery(
    api.likes.getReactionStatus, 
    visitorId ? { visitorId, contentId } : "skip"
  )
  const shareCount = useQuery(api.shares.getCount, { contentId })
  
  const toggleReaction = useMutation(api.likes.toggle)
  const trackShare = useMutation(api.shares.track)

  const handleReaction = async (type: 'like' | 'love') => {
    if (!visitorId) return
    await toggleReaction({
      visitorId,
      contentId,
      contentType,
      reactionType: type,
    })
  }

  const handleShare = async (platform: string) => {
    const url = window.location.href
    const title = document.title

    await trackShare({ contentId, contentType, platform })

    if (platform === 'copy') {
      navigator.clipboard.writeText(url)
      setShowShareMenu(false)
      return
    }

    let shareUrl = ''
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
        break
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
    setShowShareMenu(false)
  }

  const likeCount = status?.likeCount ?? 0
  const loveCount = status?.loveCount ?? 0
  const userReaction = status?.userReaction

  return (
    <div className="flex items-center gap-2">
      {/* Like Button */}
      <button
        onClick={() => handleReaction('like')}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          userReaction === 'like'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <span>👍</span>
        <span>{likeCount}</span>
      </button>

      {/* Love Button */}
      <button
        onClick={() => handleReaction('love')}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          userReaction === 'love'
            ? 'bg-red-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <span>❤️</span>
        <span>{loveCount}</span>
      </button>

      {/* Share Button */}
      {showShare && (
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
          >
            <span>📤</span>
            <span>{shareCount ?? 0}</span>
          </button>

          {showShareMenu && (
            <div className="absolute bottom-full right-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-100 p-2 min-w-[140px] z-50">
              <button
                onClick={() => handleShare('copy')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
              >
                <span>📋</span> Copy Link
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
              >
                <span>🐦</span> Twitter
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
              >
                <span>📘</span> Facebook
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2"
              >
                <span>💬</span> WhatsApp
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
