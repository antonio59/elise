'use client'
import { useQuery } from 'convex/react'
import { api, useAuth } from '@/lib/convex'

export default function ReadingCalendar() {
  const { token } = useAuth()
  const calendarData = useQuery(api.goals.getReadingCalendar, token ? { token } : "skip") ?? []

  const currentYear = new Date().getFullYear()
  const today = new Date()
  
  // Create a map of date -> pages read
  const readingMap = new Map<string, number>()
  calendarData.forEach((entry) => {
    readingMap.set(entry.date, entry.pagesRead)
  })

  // Generate all days of the year
  const startDate = new Date(currentYear, 0, 1)
  const endDate = new Date(currentYear, 11, 31)
  const days: { date: Date; pages: number }[] = []

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    days.push({
      date: new Date(d),
      pages: readingMap.get(dateStr) || 0,
    })
  }

  // Group by week
  const weeks: typeof days[] = []
  let currentWeek: typeof days = []
  
  // Pad the first week
  const firstDayOfWeek = days[0].date.getDay()
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push({ date: new Date(0), pages: -1 })
  }

  days.forEach((day) => {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: new Date(0), pages: -1 })
    }
    weeks.push(currentWeek)
  }

  const getColor = (pages: number) => {
    if (pages < 0) return 'bg-transparent'
    if (pages === 0) return 'bg-neutral-100 dark:bg-neutral-800'
    if (pages < 20) return 'bg-inkLime/30'
    if (pages < 50) return 'bg-inkLime/50'
    if (pages < 100) return 'bg-inkLime/70'
    return 'bg-inkLime'
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
      <h4 className="font-medium mb-4">📅 Reading Activity</h4>
      
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Month labels */}
          <div className="flex mb-1 text-xs text-neutral-500">
            <div className="w-8" />
            {months.map((month, i) => (
              <div key={month} className="flex-1 text-center">
                {month}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="flex gap-[2px]">
            {/* Day labels */}
            <div className="flex flex-col gap-[2px] text-xs text-neutral-500 pr-1">
              <span className="h-3" />
              <span className="h-3">M</span>
              <span className="h-3" />
              <span className="h-3">W</span>
              <span className="h-3" />
              <span className="h-3">F</span>
              <span className="h-3" />
            </div>

            {/* Weeks */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[2px]">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`w-3 h-3 rounded-sm ${getColor(day.pages)} ${
                      day.pages >= 0 && day.date <= today ? 'hover:ring-2 ring-inkPink cursor-pointer' : ''
                    }`}
                    title={day.pages >= 0 && day.date <= today ? `${day.date.toDateString()}: ${day.pages} pages` : ''}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 text-xs text-neutral-500">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-neutral-100 dark:bg-neutral-800" />
              <div className="w-3 h-3 rounded-sm bg-inkLime/30" />
              <div className="w-3 h-3 rounded-sm bg-inkLime/50" />
              <div className="w-3 h-3 rounded-sm bg-inkLime/70" />
              <div className="w-3 h-3 rounded-sm bg-inkLime" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  )
}
