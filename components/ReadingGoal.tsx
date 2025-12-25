'use client'
import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api, useAuth } from '@/lib/convex'

export default function ReadingGoal() {
  const { token } = useAuth()
  const [editing, setEditing] = useState(false)
  const [targetBooks, setTargetBooks] = useState(12)

  const goal = useQuery(api.goals.getCurrentGoal, token ? { token } : "skip")
  const setGoal = useMutation(api.goals.setGoal)

  const handleSave = async () => {
    if (!token) return
    await setGoal({ token, targetBooks })
    setEditing(false)
  }

  const currentYear = new Date().getFullYear()

  if (!token) return null

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium">📚 {currentYear} Reading Goal</h4>
        {!editing && (
          <button
            onClick={() => {
              setTargetBooks(goal?.targetBooks || 12)
              setEditing(true)
            }}
            className="text-xs text-inkPink hover:underline"
          >
            {goal ? 'Edit' : 'Set Goal'}
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <div>
            <label className="text-sm text-neutral-500">Books to read this year</label>
            <input
              type="number"
              min="1"
              max="365"
              value={targetBooks}
              onChange={(e) => setTargetBooks(parseInt(e.target.value) || 1)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-inkPink text-white text-sm font-medium hover:bg-pink-600"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : goal ? (
        <div>
          <div className="flex items-end justify-between mb-2">
            <span className="text-3xl font-bold text-inkPurple">{goal.booksRead}</span>
            <span className="text-neutral-500">/ {goal.targetBooks} books</span>
          </div>
          <div className="h-3 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-inkPink to-inkPurple rounded-full transition-all duration-500"
              style={{ width: `${goal.percentComplete}%` }}
            />
          </div>
          <p className="text-sm text-neutral-500 mt-2">
            {goal.percentComplete >= 100 ? (
              <span className="text-green-500 font-medium">🎉 Goal achieved!</span>
            ) : (
              `${goal.targetBooks - goal.booksRead} more to go!`
            )}
          </p>
        </div>
      ) : (
        <p className="text-sm text-neutral-500">Set a reading goal to track your progress this year!</p>
      )}
    </div>
  )
}
