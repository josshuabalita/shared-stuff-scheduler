namespace Api.Models;

public record ReservationRequest(
    int ResourceId,
    string? EmployeeName,
    DateTime StartDateTime,
    DateTime EndDateTime
);