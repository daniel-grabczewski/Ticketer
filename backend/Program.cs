using backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;

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

// Add CORS policy to allow your frontend (Angular) to access your API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:4200") // Angular frontend URL
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // Important for cookies
    });
});

// Add JWT Bearer authentication for Auth0
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Authority = "https://dev-3l5ve3any1ptgo1l.us.auth0.com/";
    options.Audience = "https://ticketer-api";
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true
    };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            // Do not fail the request; allow anonymous access
            context.NoResult();
            context.Response.StatusCode = 401;
            context.Response.ContentType = "application/json";
            return context.Response.WriteAsync("{\"error\":\"Authentication failed.\"}");
        },
        OnChallenge = context =>
        {
            // Skip the default challenge response
            context.HandleResponse();
            if (!context.Response.HasStarted)
            {
                context.Response.StatusCode = 401;
                context.Response.ContentType = "application/json";
                context.Response.WriteAsync("{\"error\":\"Unauthorized access.\"}");
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization(); // Add authorization services

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    // Do not use HTTPS redirection in development if not using HTTPS
    // app.UseHttpsRedirection();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
    app.UseHttpsRedirection(); // Use HTTPS redirection in production
}

app.UseRouting();

app.UseCors("AllowFrontend");

app.UseAuthentication(); // Must come before UseAuthorization
app.UseAuthorization();  // Must come after UseAuthentication

app.MapControllers();

app.Run();
