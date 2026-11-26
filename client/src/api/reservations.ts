import type { Reservation, ReservationRequest, Resource } from '../types'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options)
    const body = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(body?.message ?? 'Something went wrong. Please try again.')
    }
    return body as T
}

export const getResources = () => request<Resource[]>('/api/resources')

export const getReservations = () => request<Reservation[]>('/api/reservations')

export const createReservation = (reservation: ReservationRequest) =>
    request<Reservation>('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservation),
    })