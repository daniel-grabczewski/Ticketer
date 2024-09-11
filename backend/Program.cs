using backend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register DbContext with MySQL using connection string from appsettings.json
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));

// Add CORS policy (example)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Add exception handling middleware
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error"); // or custom error handling page
    app.UseHsts(); // Use HSTS (HTTP Strict Transport Security) in production
}

app.UseHttpsRedirection();

app.UseRouting(); // Adds routing middleware WHY IS THIS FIRST

app.UseCors("AllowAllOrigins"); // Enable CORS

app.UseAuthentication(); // Adds authentication middleware (if needed)

app.UseAuthorization(); // Adds authorization middleware

app.MapControllers(); // Maps routes to controllers

app.Run();

// So Controllers are just classes with methods (actions) inside of them that handle different types of requests.
// So, the controller for /users will have different actions depending on whether its GET POST PUT DELETE
// Go through and understand everything here.. Controllers, actions, public/private, how to interact with the db with EF Core, etc.
// Understand the entire pipeline.
// Once that's done, then move on to creating the front end with angular and turning this into a github repo.