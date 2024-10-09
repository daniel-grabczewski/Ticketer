using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpGet("generateGuestId")]
    public IActionResult GenerateGuestId()
    {
        string guestId = Guid.NewGuid().ToString(); // Generate unique guest ID
        CookieOptions options = new CookieOptions
        {
            Expires = DateTime.Now.AddDays(30), // 30-day expiry
            HttpOnly = true, // Ensure it's only accessible by the server
            Secure = true // Only send over HTTPS
        };
        
        Response.Cookies.Append("GuestId", guestId, options); // Store guest ID in a cookie

        return Ok(new { GuestId = guestId });
    }
}
