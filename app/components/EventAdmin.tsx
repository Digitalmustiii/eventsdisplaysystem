//components/EventAdmin.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { format } from 'date-fns'

type Event = {
  id: number
  event_date: string
  title: string
  time?: string
  venue?: string
}

export default function EventAdmin() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState('')
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [timeAmPm, setTimeAmPm] = useState('AM')
  const [venue, setVenue] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Get current date in Chengdu timezone (UTC+8)
  const getChengduDate = () => {
    const now = new Date()
    // Convert to Chengdu time (UTC+8)
    const chengduTime = new Date(now.getTime() + (8 * 60 * 60 * 1000) + (now.getTimezoneOffset() * 60 * 1000))
    return chengduTime
  }

  // Get minimum date (today in Chengdu timezone)
  const getMinDate = () => {
    const chengduDate = getChengduDate()
    return format(chengduDate, 'yyyy-MM-dd')
  }

  // Check if an event has expired based on Chengdu time
  const isEventExpired = (eventDate: string, eventTime?: string) => {
    const chengduNow = getChengduDate()
    const eventDateTime = new Date(eventDate)
    
    if (eventTime) {
      // Parse time (e.g., "2:30 PM" -> set hours and minutes)
      const timeMatch = eventTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
      if (timeMatch) {
        let hours = parseInt(timeMatch[1])
        const minutes = parseInt(timeMatch[2])
        const ampm = timeMatch[3].toUpperCase()
        
        if (ampm === 'PM' && hours !== 12) hours += 12
        if (ampm === 'AM' && hours === 12) hours = 0
        
        eventDateTime.setHours(hours, minutes, 0, 0)
      }
    } else {
      // If no time specified, consider event expired at end of day
      eventDateTime.setHours(23, 59, 59, 999)
    }
    
    return chengduNow > eventDateTime
  }

  const fetchEvents = useCallback(() => {
    setLoading(true)
    setError('')
    fetch('/api/admin/events')
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch events')
        return r.json()
      })
      .then((data: Event[]) => {
        console.log('Events fetched:', data.length, data) // Debug log
        setEvents(data)
      })
      .catch(err => {
        console.error('Error fetching events:', err)
        setError('Failed to load events. Please try again.')
      })
      .finally(() => setLoading(false))
  }, [])

  // Auto-delete expired events
  const deleteExpiredEvents = useCallback(async () => {
    const expiredEvents = events.filter(event => 
      isEventExpired(event.event_date, event.time)
    )
    
    for (const event of expiredEvents) {
      try {
        await fetch('/api/admin/events', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: event.id })
        })
        console.log(`Auto-deleted expired event: ${event.title}`)
      } catch (err) {
        console.error(`Failed to auto-delete event ${event.id}:`, err)
      }
    }
    
    if (expiredEvents.length > 0) {
      await fetchEvents() // Refresh the list
    }
  }, [events, fetchEvents])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  // Auto-delete expired events when events are loaded
  useEffect(() => {
    if (events.length > 0) {
      deleteExpiredEvents()
    }
  }, [events, deleteExpiredEvents])

  // Set up interval to check for expired events every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (events.length > 0) {
        deleteExpiredEvents()
      }
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [events, deleteExpiredEvents])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    
    // Validate date is not in the past
    const selectedDate = new Date(date)
    const chengduToday = getChengduDate()
    chengduToday.setHours(0, 0, 0, 0) // Reset time for date comparison
    
    if (selectedDate < chengduToday) {
      setError('Cannot create events for past dates')
      setSubmitting(false)
      return
    }
    
    // If same day and time is provided, validate time is not in the past
    if (time && format(selectedDate, 'yyyy-MM-dd') === format(chengduToday, 'yyyy-MM-dd')) {
      const timeMatch = time.match(/(\d{1,2}):(\d{2})/)
      if (timeMatch) {
        let hours = parseInt(timeMatch[1])
        const minutes = parseInt(timeMatch[2])
        
        if (timeAmPm === 'PM' && hours !== 12) hours += 12
        if (timeAmPm === 'AM' && hours === 12) hours = 0
        
        const eventDateTime = new Date(selectedDate)
        eventDateTime.setHours(hours, minutes, 0, 0)
        
        if (eventDateTime <= getChengduDate()) {
          setError('Cannot create events for past times')
          setSubmitting(false)
          return
        }
      }
    }
    
    // Format time with AM/PM if time is provided
    const formattedTime = time ? `${time} ${timeAmPm}` : ''
    
    try {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          event_date: date, 
          title, 
          time: formattedTime, 
          venue 
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to create event')
      }
      
      setDate(''); setTitle(''); setTime(''); setTimeAmPm('AM'); setVenue('')
      await fetchEvents()
    } catch (err) {
      console.error('Error adding event:', err)
      setError('Failed to create event. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    setError('')
    try {
      const response = await fetch('/api/admin/events', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete event')
      }
      
      await fetchEvents()
    } catch (err) {
      console.error('Error deleting event:', err)
      setError('Failed to delete event. Please try again.')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Existing Events */}
      <div className="lg:order-2 bg-[#101926] rounded-xl shadow-lg overflow-hidden border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700" 
             style={{
               background: 'linear-gradient(to right, #163E8C, #0367A6)'
             }}>
          <h2 className="text-xl font-medium flex items-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Upcoming Events ({events.length})
          </h2>
        </div>
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 text-red-200 rounded-lg">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No events scheduled</p>
              <p className="text-sm">Add your first event using the form</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {events.map(ev => (
                <div
                  key={ev.id}
                  className="flex justify-between items-center p-3 bg-[#171f2e] rounded-lg transition-all hover:bg-[#1a2536]"
                >
                  <div className="flex items-center">
                    <div className="bg-[#163E8C] bg-opacity-30 text-blue-300 rounded p-2 mr-3 w-12 h-12 flex flex-col items-center justify-center text-xs">
                      <span className="font-bold">{format(new Date(ev.event_date), 'dd')}</span>
                      <span>{format(new Date(ev.event_date), 'MMM')}</span>
                    </div>
                    <div>
                      <div className="font-medium">{ev.title}</div>
                      <div className="text-sm text-gray-400 flex flex-wrap items-center">
                        {ev.time && (
                          <span className="flex items-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {ev.time}
                          </span>
                        )}
                        {ev.venue && (
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {ev.venue}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(ev.id)}
                    className="p-1.5 rounded-full bg-red-500 bg-opacity-10 text-red-400 hover:bg-opacity-20 transition-colors"
                    aria-label="Delete event"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add New Event */}
      <div className="lg:order-1 bg-[#101926] rounded-xl shadow-lg overflow-hidden border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700"
             style={{
               background: 'linear-gradient(to right, #163E8C, #0367A6)'
             }}>
          <h2 className="text-xl font-medium flex items-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New Event
          </h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleAdd} className="grid gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Date <span className="text-xs text-gray-400">(Chengdu Time)</span>
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 bg-[#171f2e] border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={date}
                onChange={e => setDate(e.target.value)}
                min={getMinDate()}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Event Title</label>
              <input
                className="w-full px-4 py-2.5 bg-[#171f2e] border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter event title"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-5">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Time (optional)</label>
                <input
                  type="time"
                  className="w-full px-4 py-2.5 bg-[#171f2e] border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">AM/PM</label>
                <select
                  className="w-full px-4 py-2.5 bg-[#171f2e] border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={timeAmPm}
                  onChange={e => setTimeAmPm(e.target.value)}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Venue (optional)</label>
              <input
                className="w-full px-4 py-2.5 bg-[#171f2e] border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={venue}
                onChange={e => setVenue(e.target.value)}
                placeholder="Event location"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 py-3 px-4 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(to right, #163E8C, #0367A6)'
              }}
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Event...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Event
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}