// These match the C# models. The API sends property names in camelCase.
export interface Resource {
    resourceId: number
    resourceName: string
    resourceDescription: string
}

export interface Reservation {
    reservationId: number
    resourceId: number
    employeeName: string
    startDateTime: string // dates arrive as text in JSON
    endDateTime: string
}

// Everything except the ID, which the server assigns
export type ReservationRequest = Omit<Reservation, 'reservationId'>