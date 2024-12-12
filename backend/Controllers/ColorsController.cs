using Microsoft.AspNetCore.Mvc;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using DTOs.Color; // Using your existing DTOs for colors

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ColorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ColorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/colors
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllColors()
        {
            try
            {
                var colors = await _context.Colors
                    .Select(c => new GetColorsResponseDTO
                    {
                        Id = c.Id,
                        HexCode = c.HexCode
                    })
                    .ToListAsync();
                
                return Ok(colors);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while retrieving colors.");
            }
        }

        // GET: api/colors/{colorId}
        [HttpGet("{colorId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetColorHexById(string colorId)
        {
            if (string.IsNullOrEmpty(colorId))
            {
                return BadRequest("Color ID is required.");
            }

            // Attempt to parse the colorId to an integer
            if (!int.TryParse(colorId, out int parsedColorId))
            {
              return BadRequest("Invalid Color ID format.");
            }

            var color = await _context.Colors
              .FirstOrDefaultAsync(c => c.Id == parsedColorId);

            if (color == null)
            {
                return NotFound("Color not found.");
            }

            return Ok(color.HexCode);
        }
              // New GET: api/colors/test
        [HttpGet("test")]
        [AllowAnonymous]
        public IActionResult GetTestColors()
        {
            var testColors = new List<GetColorsResponseDTO>
            {
                new GetColorsResponseDTO { Id = 1, HexCode = "#FF5733" },
                new GetColorsResponseDTO { Id = 2, HexCode = "#33FF57" },
                new GetColorsResponseDTO { Id = 3, HexCode = "#3357FF" }
            };

            return Ok(testColors);
        }
    }
}
