using Microsoft.AspNetCore.Mvc;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using YourProject.Models;
using DTOs.Board;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BoardsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BoardsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/boards
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllBoards()
        {
            string userId = await GetUserIdAsync();
            if (userId == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            var boards = await _context.Boards
                .Where(b => b.UserId == userId)
                .Include(b => b.Lists)
                    .ThenInclude(l => l.Tickets)
                .Select(b => new GetAllBoardsDetailsResponseDTO
                {
                    Id = b.Id,
                    Name = b.Name,
                    ColorId = b.ColorId,
                    ListCount = b.Lists.Count,
                    TicketCount = b.Lists.SelectMany(l => l.Tickets).Count()
                })
                .ToListAsync();

            return Ok(boards);
        }

        // GET: api/boards/{boardId}
        [HttpGet("{boardId}")]
        [Authorize]
        public async Task<IActionResult> GetBoardById(string boardId)
        {
            string userId = await GetUserIdAsync();
            if (userId == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            var board = await _context.Boards
                .Include(b => b.Lists.OrderBy(l => l.Position))
                    .ThenInclude(l => l.Tickets.OrderBy(t => t.Position))
                .FirstOrDefaultAsync(b => b.Id == boardId && b.UserId == userId);

            if (board == null)
            {
                return NotFound("Board not found or you do not have access.");
            }

            var response = new GetBoardFullDetailsResponseDTO
            {
                Id = board.Id,
                Name = board.Name,
                ColorId = board.ColorId,
                Auth0Id = userId,
                Lists = board.Lists.Select(l => new ListDTO
                {
                    Id = l.Id,
                    Name = l.Name,
                    Position = l.Position,
                    Tickets = l.Tickets.Select(t => new TicketDTO 
                    {
                        Id = t.Id,
                        Name = t.Name,
                        Description = t.Description,
                        Position = t.Position,
                        ColorId = t.ColorId
                    }).ToList()
                }).ToList()
            };

            return Ok(response);
        }

        // POST: api/boards
        [HttpPost]
        [AllowAnonymous] // Allow guest users to create boards
        public async Task<IActionResult> CreateBoard([FromBody] CreateBoardRequestDTO request)
        {
            // Validate the request
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string userId = await GetUserIdAsync();
            if (userId == null)
            {
                return Unauthorized("User is not authenticated or guest ID is missing.");
            }

            // Create the new board
            var board = new Board
            {
                Id = request.Id,
                Name = request.Name,
                ColorId = request.ColorId,
                UserId = userId
            };

            await _context.Boards.AddAsync(board);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Board created successfully!" });
        }

        // POST: api/boards/duplicate
        [HttpPost("duplicate")]
        [Authorize]
        public async Task<IActionResult> DuplicateBoard([FromBody] CreateDuplicateBoardRequestDTO request)
        {
            // Validate the request
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string userId = await GetUserIdAsync();
            if (userId == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            // Retrieve the original board
            var originalBoard = await _context.Boards
                .Include(b => b.Lists.OrderBy(l => l.Position))
                    .ThenInclude(l => l.Tickets.OrderBy(t => t.Position))
                .FirstOrDefaultAsync(b => b.Id == request.OriginalBoardId && b.UserId == userId);

            if (originalBoard == null)
            {
                return NotFound("Original board not found or you do not have access.");
            }

            // Create the new board
            var newBoard = new Board
            {
                Id = request.NewBoardId,
                Name = request.NewName,
                ColorId = request.ColorId,
                UserId = userId
            };

            await _context.Boards.AddAsync(newBoard);

            // Duplicate lists and tickets
            foreach (var list in originalBoard.Lists)
            {
                var newList = new List
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = list.Name,
                    Position = list.Position,
                    BoardId = newBoard.Id
                };
                await _context.Lists.AddAsync(newList);

                foreach (var ticket in list.Tickets)
                {
                    var newTicket = new Ticket
                    {
                        Id = Guid.NewGuid().ToString(),
                        Name = ticket.Name,
                        Description = ticket.Description,
                        Position = ticket.Position,
                        ColorId = ticket.ColorId,
                        ListId = newList.Id
                    };
                    await _context.Tickets.AddAsync(newTicket);
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Board duplicated successfully!" });
        }

        // PUT: api/boards
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateBoard([FromBody] UpdateBoardRequestDTO request)
        {
            // Validate the request
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string userId = await GetUserIdAsync();
            if (userId == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            // Retrieve the board
            var board = await _context.Boards.FirstOrDefaultAsync(b => b.Id == request.Id && b.UserId == userId);

            if (board == null)
            {
                return NotFound("Board not found or you do not have access.");
            }

            // Update board details
            board.Name = request.Name;
            board.ColorId = request.ColorId;

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Board updated successfully!" });
        }

        // DELETE: api/boards/{boardId}
        [HttpDelete("{boardId}")]
        [Authorize]
        public async Task<IActionResult> DeleteBoard(string boardId)
        {
            string userId = await GetUserIdAsync();
            if (userId == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            // Retrieve the board
            var board = await _context.Boards
                .Include(b => b.Lists)
                    .ThenInclude(l => l.Tickets)
                .FirstOrDefaultAsync(b => b.Id == boardId && b.UserId == userId);

            if (board == null)
            {
                return NotFound("Board not found or you do not have access.");
            }

            // Remove the board (lists and tickets should be removed due to cascade delete)
            _context.Boards.Remove(board);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Board deleted successfully!" });
        }

        // Helper method to get the user ID (Authenticated user ID or Guest ID)
        private async Task<string> GetUserIdAsync()
        {
            // Check if the user is authenticated
            if (User.Identity.IsAuthenticated)
            {
                return User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            }
            else
            {
                // Check if the user is a guest by checking the GuestId cookie
                string guestId = Request.Cookies["GuestId"];

                if (!string.IsNullOrEmpty(guestId))
                {
                    // Verify that the guest user exists
                    var guestUserExists = await _context.Users.AnyAsync(u => u.Id == guestId && u.IsGuest);

                    if (guestUserExists)
                    {
                        return guestId;
                    }
                }
            }

            return null; // User is neither authenticated nor a valid guest
        }
    }
}