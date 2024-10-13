using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/users/isRegistered
        [HttpGet("isRegistered")]
        public async Task<IActionResult> IsUserRegistered()
        {
            // Get the Auth0 user ID from the claims
            string auth0UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(auth0UserId))
            {
                return Unauthorized();
            }

            // Check if the user exists in the Users table
            bool isRegistered = await _context.Users.AnyAsync(u => u.UserId == auth0UserId);

            return Ok(new { IsRegistered = isRegistered });
        }
    }
}
