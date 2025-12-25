'use client'
import EngagementButtons from './EngagementButtons'

export default function LikeButton({ contentId, contentType }: { contentId: string; contentType: 'artwork' | 'review' }) {
  return <EngagementButtons contentId={contentId} contentType={contentType} showShare={false} />
}
