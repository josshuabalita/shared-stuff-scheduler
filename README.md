# Shared Stuff Scheduler

A small web application that makes the shared resources easy to reserve and helps prevent double bookings

## Goal/ Roles
- **Employee**: coordinates reservations via emails and conversations
- **Resources**: Company vehicle, portable projector, StarLink Mobile Unit
- Using our system, employees can now see what is free and book easily
- No two overlapping bookings for the same resource is allowed 

## User Flow
1. A user opens the app (no login needed)
2. Page displays available resources and resources with bookings like a dashboard
    a. can filter display by today, this week, or all upcoming, and choose a resource
3. Employee requests a booking:
    a. pick the resource
    b. enter employee's name, requested start and end date and time
    c. hit submit 
    d. confirm the specified details
4. Results:
    a. If free, check again on the server, save the booking, and show a success message
    b. If not available, show a display message saying "Specified date and time is booked" with who booked it and when, and allow user to specify another time and date
    c. **If time allows** show nearest available time and date for the same length of booking

## System Architecture
- Frontend: React
- Backend: C# / ASP.NET
- **If time allows** Database: SQL (we will be using in memory store for the meantime)

## What does our data hold?
- **Resources**: resourceId (PK), resourceName, resourceDesc
- **Reservation**: reservationId (PK), resourceId (FK), employeeName, startDateTime, endDateTime

## Rules/ Constraints
- Do not allow overlapping bookings on the same resource (two bookings overlap if each one starts before the other ends)
- Back-to-back bookings are allowed (ex. 10-11, then 11-12)
- User can book multiple bookings on same or different resources
- Employee name and resource are required
- start date and end date (with time) is required, and end date must be dated after the start date
- start date cannot be in the past
- Server checks and saves in one step, so two users cannot book the same slot at once
