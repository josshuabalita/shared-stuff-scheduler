import { useCallback, useEffect, useState } from 'react'
import { getReservations, getResources } from './api/reservations'
import BookingForm from './components/BookingForm'
import FilterBar from './components/FilterBar'
import ResourceCard from './components/ResourceCard'
import type { Reservation, Resource } from './types'
import { startsWithin, type TimeRange } from './utils/dates'
import './App.css'

export default function App() {
  const [resources, setResources] = useState<Resource[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [resourceFilter, setResourceFilter] = useState(0)
  const [range, setRange] = useState<TimeRange>('all')
  const [selectedId, setSelectedId] = useState(0)

  const loadData = useCallback(async () => {
    try {
      const [resourceList, reservationList] = await Promise.all([
        getResources(),
        getReservations(),
      ])
      setResources(resourceList)
      setReservations(reservationList)
      setError('')
    } catch {
      setError('Could not load data. Is the API running?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const visibleResources = resources.filter(
    (r) => resourceFilter === 0 || r.resourceId === resourceFilter,
  )

  function handleBook(id: number) {
    setSelectedId(id)
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
    document.getElementById('employee-name')?.focus({ preventScroll: true })
  }

  return (
    <>
      <header className="hero">
        <div className="container">
          <p className="eyebrow">Company shared resources</p>
          <h1>Shared Stuff Scheduler</h1>
          <p>See what's free and book it in under a minute.</p>
        </div>
      </header>

      <main className="container">
        <h2>Resources</h2>
        <FilterBar
          resources={resources}
          resourceId={resourceFilter}
          range={range}
          onResourceChange={setResourceFilter}
          onRangeChange={setRange}
        />

        {loading && <p>Loading...</p>}
        {error && <p role="alert" className="error">{error}</p>}

        <div className="cards">
          {visibleResources.map((resource) => (
            <ResourceCard
              key={resource.resourceId}
              resource={resource}
              reservations={reservations.filter(
                (r) =>
                  r.resourceId === resource.resourceId && startsWithin(r.startDateTime, range),
              )}
              onBook={() => handleBook(resource.resourceId)}
            />
          ))}
        </div>

        <BookingForm
          resources={resources}
          resourceId={selectedId}
          onResourceChange={setSelectedId}
          onSubmitted={loadData}
        />
      </main>
    </>
  )
}