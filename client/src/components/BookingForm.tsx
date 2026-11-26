import { useState, type FormEvent } from 'react'
import { createReservation } from '../api/reservations'
import type { Resource } from '../types'
import { addHour, formatRange, nowForInput } from '../utils/dates'

interface BookingFormProps {
    resources: Resource[]
    resourceId: number
    onResourceChange: (id: number) => void
    onSubmitted: () => Promise<void>
}

interface Message {
    type: 'success' | 'error'
    text: string
}

export default function BookingForm({
    resources,
    resourceId,
    onResourceChange,
    onSubmitted,
}: BookingFormProps) {
    const [employeeName, setEmployeeName] = useState('')
    const [startDateTime, setStartDateTime] = useState('')
    const [endDateTime, setEndDateTime] = useState('')
    const [confirming, setConfirming] = useState(false)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<Message | null>(null)

    const resource = resources.find((r) => r.resourceId === resourceId)

    function handleStartChange(value: string) {
        setStartDateTime(value)
        // suggest a one-hour booking, but keep a later end the user already chose
        if (value && endDateTime <= value) setEndDateTime(addHour(value))
    }

    // check the basics, then ask the user to confirm
    function handleReview(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setMessage(null)

        if (!employeeName.trim()) {
            setMessage({ type: 'error', text: 'Please enter your name.' })
        } else if (endDateTime <= startDateTime) {
            setMessage({ type: 'error', text: 'End time must be after start time.' })
        } else {
            setConfirming(true)
        }
    }

    // the server checks for overlaps again and saves
    async function handleConfirm() {
        setSaving(true)
        try {
            await createReservation({
                resourceId,
                employeeName: employeeName.trim(),
                startDateTime,
                endDateTime,
            })
            setMessage({ type: 'success', text: 'Booking confirmed.' })
            setStartDateTime('')
            setEndDateTime('')
        } catch (error) {
            // The form keeps its values, so the user only has to change the time
            const text = error instanceof Error ? error.message : 'Booking failed.'
            setMessage({ type: 'error', text })
        } finally {
            setSaving(false)
            setConfirming(false)
            // Refresh either way, in case someone else booked in the meantime
            await onSubmitted()
        }
    }

    return (
        <section className="panel" id="booking">
            <h2>Request a booking</h2>

            {confirming ? (
                <div>
                    <p>Please confirm your booking:</p>
                    <p>
                        <strong>{resource?.resourceName}</strong> for <strong>{employeeName}</strong>
                        <br />
                        {formatRange(startDateTime, endDateTime)}
                    </p>
                    <div className="actions">
                        <button type="button" onClick={handleConfirm} disabled={saving}>
                            {saving ? 'Booking...' : 'Confirm'}
                        </button>
                        <button
                            type="button"
                            className="secondary"
                            onClick={() => setConfirming(false)}
                            disabled={saving}
                        >
                            Back
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleReview}>
                    <label>
                        Resource
                        <select
                            value={resourceId || ''}
                            onChange={(e) => onResourceChange(Number(e.target.value))}
                            required
                        >
                            <option value="">Select...</option>
                            {resources.map((r) => (
                                <option key={r.resourceId} value={r.resourceId}>
                                    {r.resourceName}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Your name
                        <input id="employee-name" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} required />
                    </label>
                    <label>
                        Start
                        <input
                            type="datetime-local"
                            value={startDateTime}
                            min={nowForInput()}
                            onChange={(e) => handleStartChange(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        End
                        <input
                            type="datetime-local"
                            value={endDateTime}
                            min={startDateTime}
                            onChange={(e) => setEndDateTime(e.target.value)}
                            required
                        />
                    </label>
                    <div className="actions">
                        <button type="submit">Review booking</button>
                    </div>
                </form>
            )}

            {message && (
                <p role="alert" className={message.type}>{message.text}</p>
            )}
        </section>
    )
}