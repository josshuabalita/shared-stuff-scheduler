namespace Api.Models;

public record Reservation(
    int ReservationId,
    int ResourceId,
    string EmployeeName,
    DateTime StartDateTime,
    DateTime EndDateTime
);