'use client'

import { useEffect, useState } from 'react'

export type Event = {
  id: number
  event_date: string
  title: string
  time?: string
  venue?: string
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [maxEvents, setMaxEvents] = useState(5) // Default to desktop view

  // Set max events based on screen size - Always show 5 events
  useEffect(() => {
    const updateMaxEvents = () => {
      setMaxEvents(5) // Always show 5 events regardless of screen size
    }

    // Set initial value
    updateMaxEvents()

    // Listen for window resize
    window.addEventListener('resize', updateMaxEvents)
    return () => window.removeEventListener('resize', updateMaxEvents)
  }, [])

  useEffect(() => {
    setLoading(true)
    fetch('/api/admin/events')
      .then((r) => r.json())
      .then((data: Event[]) => {
        // Sort by date ascending (first come, first served)
        const sorted = data.sort(
          (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
        )
        // Take only the first maxEvents
        setEvents(sorted.slice(0, maxEvents))
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [maxEvents])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return {
      day: String(date.getDate()).padStart(2, '0'),
      month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
    }
  }

  return (
    <div className="h-full flex flex-col bg-[#101926] text-white">
      <div
        className="py-2 lg:py-3 px-2 lg:px-4 font-bold text-lg sm:text-xl lg:text-4xl text-center"
        style={{ background: 'linear-gradient(to right, #163E8C, #0367A6)' }}
      >
        Upcoming EVENTS
      </div>
      
      <div className="flex-1 flex flex-col">
        {loading ? (
          <div className="h-full flex flex-col">
            {/* Show loading items based on maxEvents */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex border-b border-gray-600 lg:h-1/5 h-1/3"
              >
                <div className="w-full flex justify-center items-center">
                  {Math.floor(5 / 2) === i && <span className="text-sm lg:text-base">Loading events...</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {events.map((event) => {
              const { day, month } = formatDate(event.event_date)
              return (
                <div
                  key={event.id}
                  className="flex border-b border-gray-600 lg:h-1/5 h-1/3"
                >
                  {/* Date column - responsive width */}
                  <div className="w-16 sm:w-20 lg:w-24 flex flex-col items-center justify-center bg-[#101926]">
                    <span className="text-xl sm:text-2xl lg:text-4xl font-bold">{day}</span>
                    <span className="text-sm sm:text-base lg:text-xl font-medium text-gray-300">{month}</span>
                  </div>
                  
                  {/* Event details - responsive padding and text sizes */}
                  <div className="flex-1 p-2 sm:p-3 lg:p-4 lg:pl-5 flex flex-col justify-center bg-[#101926]">
                    <div className="text-sm sm:text-base lg:text-xl font-medium mb-1 line-clamp-2">{event.title}</div>
                    <div className="flex flex-wrap gap-x-2 lg:gap-x-4 text-gray-300 text-xs sm:text-sm">
                      {event.time && (
                        <span className="flex items-center">
                          <svg
                            className="w-3 h-3 lg:w-4 lg:h-4 mr-1 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span className="truncate">{event.time}</span>
                        </span>
                      )}
                      {event.venue && (
                        <span className="flex items-center">
                          <svg
                            className="w-3 h-3 lg:w-4 lg:h-4 mr-1 text-gray-400 flex-shrink-0"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span className="truncate">{event.venue}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}