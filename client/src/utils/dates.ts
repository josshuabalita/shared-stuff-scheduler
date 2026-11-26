export type TimeRange = 'today' | 'week' | 'all'

export const formatDateTime = (value: string) =>
    new Date(value).toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    })

export const isHappeningNow = (start: string, end: string) => {
    const now = new Date()
    return new Date(start) <= now && now < new Date(end)
}

// The API only returns upcoming bookings, so we only limit how far ahead to look
export const startsWithin = (start: string, range: TimeRange) => {
    if (range === 'all') return true

    const limit = new Date()
    limit.setHours(0, 0, 0, 0)
    limit.setDate(limit.getDate() + (range === 'today' ? 1 : 7))
    return new Date(start) < limit
}

// Local time in the format a datetime-local input expects
const toInputValue = (date: Date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    return local.toISOString().slice(0, 16)
}

export const nowForInput = () => toInputValue(new Date())

export const addHour = (value: string) =>
    toInputValue(new Date(new Date(value).getTime() + 60 * 60000))

// Show the date once when a booking starts and ends on the same day
export const formatRange = (start: string, end: string) => {
    const sameDay = new Date(start).toDateString() === new Date(end).toDateString()
    const endText = sameDay
        ? new Date(end).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        : formatDateTime(end)

    return `${formatDateTime(start)} – ${endText}`
}