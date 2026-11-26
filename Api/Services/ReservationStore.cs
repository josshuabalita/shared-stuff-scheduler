using Api.Models;

namespace Api.Services;

public class ReservationStore
{
    public IReadOnlyList<Resource> Resources { get; } = new List<Resource>
    {
        new(1, "Super Vehicle", "Vehicle for site visits and errands"),
        new(2, "Portable Projector", "Used for meetings or presentations"),
        new(3, "StarLink Mobile Unit", "Internet service for remote locations")
    };

    private readonly List<Reservation> _reservations = new();
    private readonly object _lock = new();
    private int _nextId = 1;

    public ReservationStore()
    {
        // mock data only
        var tomorrow = DateTime.Today.AddDays(1);
        TryAdd(1, "Alex Smith", tomorrow.AddHours(10), tomorrow.AddHours(12));
        TryAdd(2, "Jane Doe", tomorrow.AddHours(13), tomorrow.AddHours(15));
    }

    // if each one starts before the other ends, then it is a overlap
    public static bool Overlaps(DateTime startA, DateTime endA, DateTime startB, DateTime endB) => startA < endB && startB < endA;

    public List<Reservation> GetUpcoming(DateTime now)
    {
        lock(_lock)
        {
            return _reservations
                .Where(r => r.EndDateTime > now)
                .OrderBy(r => r.StartDateTime)
                .ToList();
        }
    }

    // create a new reservation, otherwise if conflicted block that request
    public (bool Added, Reservation Reservation) TryAdd (
        int resourceId, string employeeName, DateTime start, DateTime end
    )
    {
        // one request at a time can check and save
        lock (_lock)
        {
            var conflict = _reservations.FirstOrDefault(r =>
                r.ResourceId == resourceId && 
                Overlaps(r.StartDateTime, r.EndDateTime, start, end));

            if (conflict is not null) return (false, conflict);

            var reservation = new Reservation(_nextId++, resourceId, employeeName, start, end);
            _reservations.Add(reservation);
            return (true, reservation);
        }
    }


}