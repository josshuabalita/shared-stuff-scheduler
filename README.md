# Shared Stuff Scheduler

A small web application that makes the shared resources easy to reserve and helps prevent double bookings

## How to run
- Requirements: .NET 10 SDK and Node.js 20 or later

1. Clone the repo
    ```
    git clone https://github.com/josshuabalita/shared-stuff-scheduler.git
    cd shared-stuff-scheduler
    ```
2. Start the backend (first terminal)
    ```
    dotnet run --project Api
    ```
3. Start the frontend (second terminal, from the project folder)
    ```
    cd client
    npm install
    npm run dev
    ```
4. Open http://localhost:5173 in your browser
    - keep both terminals running
    - it uses mock data, so bookings reset when the backend restarts

## Assumptions and open-ended decisions
- Employees and reservations are in the same time zone and location (for example, only Calgary employees)
- No login is needed for now, assuming employees are taught how to use the system properly
- Bookings go to whoever books first (**first come, first served**)
- Bookings do not have a maximum length
- A booking is confirmed right away if the time is available, after the user reviews the details
- Users can have multiple bookings

## Decision I like the most
- I chose to have the backend server check for overlaps and save the booking in one locked step. This avoids relying on outdated data, and two requests for the same time cannot both succeed. The only trade-off I see is that this works for one server only. With a database, I would use a SQL transaction.

## If I had more time
- Suggest the nearest available time and date if there is a conflict with the original request
- Add a database so the data is saved and shared
- Add login so users can view and manage their own bookings
- Add a more intuitive view, such as a calendar
- Refresh the data automatically to avoid outdated information
- Add automated tests to catch bugs earlier

## How I used AI
I used Claude (Claude Code).
- **Design**: I asked AI to follow the layout and colors of the challenge document. I wrote my own versions of the design and AI helped improve them (I focused mainly on system design and backend)
- **Code**: I wrote pseudo code and designed algorithms, AI generated the code, and I typed much of it myself to understand the system
- **Improvements**: AI made UI and UX improvements, added more mock data, and helped edit this README
- **What I changed or questioned**: I chose to use TypeScript, left out a test project to stay in scope, asked why the employee name is nullable in the request, and made sure the work stayed within my system design
- **Debugging**: AI ran a quick automated test, which showed that back-to-back bookings were rejected. I had mistyped the overlap check, and I fixed it after AI pointed it out

# Josh's System Design

## Goal/ Roles
- **Employee**: currently coordinates reservations via emails and conversations
- **Resources**: Company vehicle, portable projector, StarLink Mobile Unit
- Using our system, employees can now see what is free and book easily
- No two overlapping bookings for the same resource are allowed

## User Flow
1. A user opens the app (no login needed)
2. Page displays available resources and resources with bookings like a dashboard
    - can filter display by today, next 7 days, or all upcoming, and choose a resource
3. Employee requests a booking:
    - pick the resource
    - enter employee's name, requested start and end date and time
    - click "Review booking"
    - confirm the specified details
4. Results:
    - If free, check again on the server, save the booking, and show a success message
    - If not available, show the message "Specified date and time is booked" with who booked it and when, and allow user to specify another time and date
    - **If time allows** show the nearest available time and date for the same length of booking (not built yet)

## System Architecture
- Frontend: React + TypeScript
- Backend: C# / ASP.NET
- **If time allows** Database: SQL (we are using an in-memory store for the meantime)

## What does our data hold?
- **Resources**: resourceId (PK), resourceName, resourceDescription
- **Reservation**: reservationId (PK), resourceId (FK), employeeName, startDateTime, endDateTime

## Rules/ Constraints
- Do not allow overlapping bookings on the same resource (two bookings overlap if each one starts before the other ends)
- Back-to-back bookings are allowed (ex. 10-11, then 11-12)
- Users can make multiple bookings on the same or different resources
- Employee name and resource are required
- Start and end date (with time) are required, and the end must be after the start
- Start date cannot be in the past
- Server checks and saves in one step, so two users cannot book the same slot at once
