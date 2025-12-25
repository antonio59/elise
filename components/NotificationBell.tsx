'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useQuery, useMutation } from 'convex/react'
import { api, useAuth } from '@/lib/convex'

export default function NotificationBell() {
  const { token } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const notifications = useQuery(api.notifications.getMyNotifications, token ? { token, limit: 10 } : "skip") ?? []
  const unreadCount = useQuery(api.notifications.getUnreadCount, token ? { token } : "skip") ?? 0
  const markAsRead = useMutation(api.notifications.markAsRead)
  const markAllAsRead = useMutation(api.notifications.markAllAsRead)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNotificationClick = async (notificationId: string) => {
    if (token) {
      await markAsRead({ token, notificationId: notificationId as any })
    }
  }

  const handleMarkAllRead = async () => {
    if (token) {
      await markAllAsRead({ token })
    }
  }

  const getNotificationLink = (n: any) => {
    if (n.contentType === 'artwork') return `/artwork/${n.contentId}`
    if (n.contentType === 'review') return `/review/${n.contentId}`
    if (n.type === 'follow' && n.fromUserId) return `/user/${n.fromUserId}`
    return '#'
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return '❤️'
      case 'follow': return '👋'
      case 'achievement': return '🏆'
      case 'goal': return '🎯'
      default: return '🔔'
    }
  }

  if (!token) return null

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-inkPink text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-inkPink hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-neutral-500 py-8 text-sm">No notifications yet</p>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n._id}
                  href={getNotificationLink(n)}
                  onClick={() => handleNotificationClick(n._id)}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors ${
                    !n.read ? 'bg-inkPink/5' : ''
                  }`}
                >
                  <span className="text-lg">{getNotificationIcon(n.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.read ? 'font-medium' : ''}`}>{n.message}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-inkPink flex-shrink-0 mt-2" />
                  )}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
