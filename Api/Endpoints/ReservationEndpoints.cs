using Api.Models;
using Api.Services;

namespace Api.Endpoints;

public static class ReservationEndpoints
{
    public static void MapReservationEndpoints(this WebApplication app)
    {
        app.MapGet("/api/resources", (ReservationStore store) => store.Resources);

        app.MapGet("/api/reservations", (ReservationStore store) =>
            store.GetUpcoming(DateTime.Now));

        app.MapPost("/api/reservations", CreateReservation);
    }

    private static IResult CreateReservation(ReservationRequest request, ReservationStore store)
    {
        var name = request.EmployeeName?.Trim();

        if (string.IsNullOrEmpty(name))
            return Results.BadRequest(new { message = "Please enter your name." });

        if (!store.Resources.Any(r => r.ResourceId == request.ResourceId))
            return Results.BadRequest(new { message = "Please choose a valid resource." });

        if (request.EndDateTime <= request.StartDateTime)
            return Results.BadRequest(new { message = "End time must be after start time." });

        if (request.StartDateTime < DateTime.Now)
            return Results.BadRequest(new { message = "Start time cannot be in the past." });

        var (added, reservation) = store.TryAdd(
            request.ResourceId, name, request.StartDateTime, request.EndDateTime);

        if (!added)
            return Results.Conflict(new
            {
                message = "Specified date and time is booked by " +
                          $"{reservation.EmployeeName} from " +
                          $"{reservation.StartDateTime:MMM d, h:mm tt} to " +
                          $"{reservation.EndDateTime:MMM d, h:mm tt}."
            });

        return Results.Created($"/api/reservations/{reservation.ReservationId}", reservation);
    }
}