using Api.Endpoints;
using Api.Services;
using Api.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<ReservationStore>();

var app = builder.Build();

app.MapReservationEndpoints();

app.Run("http://localhost:5080");
