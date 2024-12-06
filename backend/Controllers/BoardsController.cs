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
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            // Since [Authorize] is used, userId should never be null if authentication succeeded.
            // If userId is somehow null, return Unauthorized.
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
                    TicketCount = b.Lists.SelectMany(l => l.Tickets).Count(),
                    CreatedAt = b.CreatedAt,
                    UpdatedAt = b.UpdatedAt
                })
                .ToListAsync();

            return Ok(boards);
        }

        // GET: api/boards/{boardId}
        [HttpGet("{boardId}")]
        [Authorize]
        public async Task<IActionResult> GetBoardById(string boardId)
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
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
                CreatedAt = board.CreatedAt,
                UpdatedAt = board.UpdatedAt,
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
        [AllowAnonymous]
        public async Task<IActionResult> CreateBoard([FromBody] CreateBoardRequestDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Since this endpoint is [AllowAnonymous], we must check if user is authenticated
            // via the combined scheme. If not, return Unauthorized.
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized("User is not authenticated or guest ID is missing.");
            }

            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            var currentTime = DateTime.UtcNow;
            var board = new Board
            {
                Id = request.Id,
                Name = request.Name,
                ColorId = request.ColorId,
                UserId = userId,
                CreatedAt = currentTime,
                UpdatedAt = currentTime
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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            var originalBoard = await _context.Boards
                .Include(b => b.Lists.OrderBy(l => l.Position))
                    .ThenInclude(l => l.Tickets.OrderBy(t => t.Position))
                .FirstOrDefaultAsync(b => b.Id == request.OriginalBoardId && b.UserId == userId);

            if (originalBoard == null)
            {
                return NotFound("Original board not found or you do not have access.");
            }

            var currentTime = DateTime.UtcNow;
            var newBoard = new Board
            {
                Id = request.NewBoardId,
                Name = request.NewName,
                ColorId = request.ColorId,
                UserId = userId,
                CreatedAt = currentTime,
                UpdatedAt = currentTime
            };

            await _context.Boards.AddAsync(newBoard);

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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            var board = await _context.Boards.FirstOrDefaultAsync(b => b.Id == request.Id && b.UserId == userId);

            if (board == null)
            {
                return NotFound("Board not found or you do not have access.");
            }

            board.Name = request.Name;
            board.ColorId = request.ColorId;
            board.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Board updated successfully!" });
        }

        // DELETE: api/boards/{boardId}
        [HttpDelete("{boardId}")]
        [Authorize]
        public async Task<IActionResult> DeleteBoard(string boardId)
        {
            string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            var board = await _context.Boards
                .Include(b => b.Lists)
                    .ThenInclude(l => l.Tickets)
                .FirstOrDefaultAsync(b => b.Id == boardId && b.UserId == userId);

            if (board == null)
            {
                return NotFound("Board not found or you do not have access.");
            }

            _context.Boards.Remove(board);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Board deleted successfully!" });
        }
    }
}
