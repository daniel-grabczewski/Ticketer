using backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;

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
     options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://daniel.ngrok.app") // Allow both localhost and ngrok
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Add JWT Bearer authentication for Auth0
builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = "Combined";
        options.DefaultChallengeScheme = "Combined";
    })
    .AddPolicyScheme("Combined", "Combined Auth", options =>
    {
        // If Authorization header is present, use JWT bearer; otherwise use guest cookie scheme
        options.ForwardDefaultSelector = context =>
        {
            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                return JwtBearerDefaults.AuthenticationScheme;
            }
            return "GuestCookie";
        };
    })
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
    {
        options.Authority = "https://dev-3l5ve3any1ptgo1l.us.auth0.com/";
        options.Audience = "https://ticketer-api";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true
        };
        // Keep your JWT Bearer events if any
    })
    .AddScheme<AuthenticationSchemeOptions, GuestCookieAuthHandler>("GuestCookie", options => {});

// Authorization
builder.Services.AddAuthorization();

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

app.UseCors("AllowAllOrigins");

app.UseAuthentication(); // Must come before UseAuthorization
app.UseAuthorization();  // Must come after UseAuthentication

app.MapControllers();

app.Run();
