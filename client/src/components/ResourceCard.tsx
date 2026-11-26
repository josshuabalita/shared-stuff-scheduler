import type { Reservation, Resource } from '../types'
import { formatRange, isHappeningNow } from '../utils/dates'

interface ResourceCardProps {
    resource: Resource
    reservations: Reservation[]
    onBook: () => void
}

export default function ResourceCard({ resource, reservations, onBook }: ResourceCardProps) {
    const inUse = reservations.some((r) => isHappeningNow(r.startDateTime, r.endDateTime))

    return (
        <article className="card">
            <h3>{resource.resourceName}</h3>
            <p>{resource.resourceDescription}</p>
            <span className={inUse ? 'badge busy' : 'badge free'}>
                {inUse ? 'In use now' : 'Available now'}
            </span>

            <h4>Reservations</h4>
            {reservations.length === 0 ? (
                <p>None in this view</p>
            ) : (
                <ul>
                    {reservations.map((r) => (
                        <li key={r.reservationId}>
                            <strong>{r.employeeName}</strong>
                            <br />
                            {formatRange(r.startDateTime, r.endDateTime)}
                        </li>
                    ))}
                </ul>
            )}

            <button type="button" onClick={onBook}>Book this</button>
        </article>
    )
}