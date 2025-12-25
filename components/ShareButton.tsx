'use client'
export default function ShareButton({ title }: { title?: string }) {
  const url = typeof window !== 'undefined' ? window.location.href : ''
  
  const onShare = async () => {
    const shareData = { title: title || 'Elise', text: 'Check this out on Elise', url }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {}
    } else {
      const twitter = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`
      const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
      window.open(twitter, '_blank')
      window.open(fb, '_blank')
    }
  }

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {}
  }

  return (
    <div className="flex items-center gap-2">
      <button onClick={onShare} className="rounded-full bg-inkCyan text-white px-3 py-1">Share</button>
      <button onClick={onCopy} className="rounded-full bg-inkPurple text-white px-3 py-1">Copy Link</button>
    </div>
  )
}