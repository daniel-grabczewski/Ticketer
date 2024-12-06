using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using backend.Data;
using Microsoft.EntityFrameworkCore;

public class GuestCookieAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    private readonly ApplicationDbContext _context;

    public GuestCookieAuthHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock,
        ApplicationDbContext context) : base(options, logger, encoder, clock)
    {
        _context = context;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        // Check if GuestId cookie exists
        string guestId = Request.Cookies["GuestId"];
        if (string.IsNullOrEmpty(guestId))
        {
            return AuthenticateResult.NoResult(); // No guest cookie, no authentication here
        }

        // Check if this guest exists in the DB
        var guestExists = await _context.Users.AnyAsync(u => u.Id == guestId && u.IsGuest);
        if (!guestExists)
        {
            return AuthenticateResult.Fail("Invalid guest ID.");
        }

        // Create claims and principal for guest
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, guestId),
            new Claim("user_type", "guest")
        };
        var identity = new ClaimsIdentity(claims, "GuestCookie");
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, "GuestCookie");

        return AuthenticateResult.Success(ticket);
    }
}
