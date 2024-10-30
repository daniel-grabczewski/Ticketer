using Microsoft.AspNetCore.Mvc;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using YourProject.Models;
using DTOs.List; 

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ListsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ListsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/lists/{boardId}
        [HttpGet("{boardId}")]
        [Authorize]
        public async Task<IActionResult> GetAllLists(string boardId)
        {
            string userId = await GetUserIdAsync();
            if (userId == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            // Check if the board exists and belongs to the user
            var boardExists = await _context.Boards.AnyAsync(b => b.Id == boardId && b.UserId == userId);
            if (!boardExists)
            {
                return NotFound("Board not found or you do not have access.");
            }

            var lists = await _context.Lists
                .Where(l => l.BoardId == boardId)
                .OrderBy(l => l.Position)
                .Select(l => new GetAllListsDetailsResponseDTO
                {
                    Id = l.Id,
                    Name = l.Name,
                })
                .ToListAsync();

            return Ok(lists);
        }

        // POST: api/lists
        [HttpPost]
        [AllowAnonymous] // Allow guest users to create lists
        public async Task<IActionResult> CreateList([FromBody] CreateListRequestDTO request)
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

            // Check if the board exists and belongs to the user
            var board = await _context.Boards.FirstOrDefaultAsync(b => b.Id == request.BoardId && b.UserId == userId);
            if (board == null)
            {
                return NotFound("Board not found or you do not have access.");
            }

            // Determine the next position (furthest on the right)
            int nextPosition = await _context.Lists
                .Where(l => l.BoardId == request.BoardId)
                .MaxAsync(l => (int?)l.Position) ?? 0;
            nextPosition += 1;

            // Create the new list
            var newList = new List
            {
                Id = request.Id,
                Name = request.Name,
                BoardId = request.BoardId,
                Position = nextPosition
            };

            await _context.Lists.AddAsync(newList);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "List created successfully!" });
        }

        // POST: api/lists/duplicate
        [HttpPost("duplicate")]
        [Authorize]
        public async Task<IActionResult> DuplicateList([FromBody] CreateDuplicateListRequestDTO request)
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

            // Retrieve the original list
            var originalList = await _context.Lists
                .Include(l => l.Board)
                .Include(l => l.Tickets.OrderBy(t => t.Position))
                .FirstOrDefaultAsync(l => l.Id == request.OriginalListId && l.Board.UserId == userId);

            if (originalList == null)
            {
                return NotFound("Original list not found or you do not have access.");
            }

            // Adjust positions of lists to the right of the original list
            var listsToAdjust = await _context.Lists
                .Where(l => l.BoardId == originalList.BoardId && l.Position > originalList.Position)
                .ToListAsync();

            foreach (var list in listsToAdjust)
            {
                list.Position += 1;
            }

            // Create the new duplicated list
            var newList = new List
            {
                Id = request.NewListId,
                Name = request.NewListName,
                BoardId = originalList.BoardId,
                Position = originalList.Position + 1
            };
            await _context.Lists.AddAsync(newList);

            // Duplicate tickets
            foreach (var ticket in originalList.Tickets)
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

            await _context.SaveChangesAsync();

            return Ok(new { Message = "List duplicated successfully!" });
        }

        // PUT: api/lists
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateList([FromBody] UpdateListRequestDTO request)
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

            // Retrieve the list
            var list = await _context.Lists
                .Include(l => l.Board)
                .FirstOrDefaultAsync(l => l.Id == request.Id && l.Board.UserId == userId);

            if (list == null)
            {
                return NotFound("List not found or you do not have access.");
            }

            // Update list details
            list.Name = request.Name;

            await _context.SaveChangesAsync();

            return Ok(new { Message = "List updated successfully!" });
        }

        // PUT: api/lists/changePosition
       [HttpPut("changePosition")]
[Authorize]
public async Task<IActionResult> UpdateListPosition([FromBody] UpdateListPositionRequestDTO request)
{
    // Validate the request
    if (string.IsNullOrEmpty(request.Id) || request.NewPosition < 1)
    {
        return BadRequest("List ID and valid new position are required.");
    }

    string userId = await GetUserIdAsync();
    if (userId == null)
    {
        return Unauthorized("User is not authenticated.");
    }

    // Retrieve the list
    var list = await _context.Lists
        .Include(l => l.Board)
        .FirstOrDefaultAsync(l => l.Id == request.Id && l.Board.UserId == userId);

    if (list == null)
    {
        return NotFound("List not found or you do not have access.");
    }

    int originalPosition = list.Position;
    int newPosition = request.NewPosition;

    if (originalPosition == newPosition)
    {
        // No change in position
        return Ok(new { Message = "List position unchanged." });
    }

    // Retrieve the board ID
    string boardId = list.BoardId;

    // Start a database transaction
    using (var transaction = await _context.Database.BeginTransactionAsync())
    {
        try
        {
            if (newPosition < originalPosition)
            {
                // Moving the list to the left
                // Shift lists between newPosition and originalPosition - 1 to the right by 1
                var updateQuery = @"
                    UPDATE Lists
                    SET Position = Position + 1
                    WHERE BoardId = {0} AND Position >= {1} AND Position < {2} AND Id <> {3}";
                await _context.Database.ExecuteSqlRawAsync(
                    updateQuery,
                    boardId,
                    newPosition,
                    originalPosition,
                    list.Id
                );
            }
            else
            {
                // Moving the list to the right
                // Shift lists between originalPosition + 1 and newPosition to the left by 1
                var updateQuery = @"
                    UPDATE Lists
                    SET Position = Position - 1
                    WHERE BoardId = {0} AND Position > {1} AND Position <= {2} AND Id <> {3}";
                await _context.Database.ExecuteSqlRawAsync(
                    updateQuery,
                    boardId,
                    originalPosition,
                    newPosition,
                    list.Id
                );
            }

            // Update the position of the moved list
            list.Position = newPosition;
            _context.Entry(list).Property(x => x.Position).IsModified = true;

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new { Message = "List position updated successfully." });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}


        // DELETE: api/lists/{listId}
        [HttpDelete("{listId}")]
        [Authorize]
        public async Task<IActionResult> DeleteList(string listId)
        {
            string userId = await GetUserIdAsync();
            if (userId == null)
            {
                return Unauthorized("User is not authenticated.");
            }

            // Retrieve the list
            var list = await _context.Lists
                .Include(l => l.Board)
                .FirstOrDefaultAsync(l => l.Id == listId && l.Board.UserId == userId);

            if (list == null)
            {
                return NotFound("List not found or you do not have access.");
            }

            int listPosition = list.Position;
            string boardId = list.BoardId;

            // Remove the list (tickets should be removed due to cascade delete)
            _context.Lists.Remove(list);

            // Adjust positions of other lists in the board
            var listsToAdjust = await _context.Lists
                .Where(l => l.BoardId == boardId && l.Position > listPosition)
                .ToListAsync();

            foreach (var l in listsToAdjust)
            {
                l.Position -= 1;
            }

            await _context.SaveChangesAsync();

            return Ok(new { Message = "List deleted successfully." });
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
