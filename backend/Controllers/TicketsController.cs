using Microsoft.AspNetCore.Mvc;
using backend.Models; // Assuming you have a Ticket model class created in Models folder
using backend.Data;

/*
ApiController is an attribute (originally defined as a class that is marked as an attribute due to inheriting the Attribute class)
If it is declared above a Controller class, it provides metadata (code that  gives functionality to simplify development)
  - Automatic Error Handling: Automatically returns HTTP 400 Bad Request responses when the incoming request is invalid (e.g., model validation fails). This reduces the need for manually checking model states and writing repetitive error handling code.
  - Automatic model state validation (checking the type of the model against the data receieved). So, technically, in this line:
      public IActionResult CreateTicket([FromBody] Ticket newTicket)
      You wouldn't need to use [FromBody], as the ApiController attribute would infer that a complex data type with a model of Ticket would come from the body (and not a number/string from a query/paramter in the URL)
      However, it's just best practise to include this for clarity anyway.
  - All in all, it mostly just reduces boilerplate code for error handling, doing it behind the scenes for you.
*/

[ApiController]
/*
The square brackets [] around ApiController tell the C# compiler that ApiController is an attribute being applied to TicketsController below it
*/
[Route("api/[controller]")]  // Route: /api/tickets
/* 
  The Route attribute's purpose is to provide metadata to the TicketsController class below it, which provides routing information to ASP.NET
  The [controller] inside "api/[controller]" is a special .NET syntax that extracts the name 'tickets' from the class below. 
  .NET knows that the class below is a controller, due to the class it inherits from 'ControllerBase'
  .NET knows to then ignore the 'Controller' in 'TicketsController', and only extract 'tickets'
  Thus, the completed route is [Route("api/tickets")]
  And now .NET knows that when the "api/tickets" routes is hit, then to look for the actions in TicketsController
*/
public class TicketsController : ControllerBase
{

    private readonly ApplicationDbContext _context;
     // Create a private readonly field (field = variable in a class) of type ApplicationDbContext, called _context
     // This variable can only be modified assigned in a constructor. After that, it can't be assigned again.

    public TicketsController(ApplicationDbContext context)
    // This is a constructor that is used to inject (provide an instance of a dependency, such as a class or service, created and managed by the framework) into this class.
    {
        _context = context;  // Assign the injected context to the private field
    }

    // POST: api/tickets
    [HttpPost]
    /*
    HttpPost is an attribute that gives metadata to the method below (decorating it), which denotes it as a method that is meant to handle POST requests.
    So when .NET goes through this code, it will understand that CreateTicket is used for POST requests
    It will tell .NET to run the function CreateTicket when a POST request comes through.
    */
    public IActionResult CreateTicket([FromBody] Ticket newTicket)
/*
  Here we are declaring a method called  CreateTicket, that .NET will have access to call behind the scenes.
  IActionResult is an interface that denotes the type of response that CreateTicket should give.
  Some types of responses include: Ok(), BadRequest(), NotFound()
  NOTE: [ApiController] can already handle providing errors for bad requests/errors, but we can manually put them in if we want more specialized error messages/specific logic. With this, .NET will know that our manual error checking overrides the automatic error checking.
  [FromBody] is an attribute that gives metadata to the CreateTicket method. This metadata does the following:
    - Tells .NET that the newTicket needs to take a deserialized (converted from JSON) version of the request body.
    - The data should be an instance of the Ticket class (which is like an interface)
    - Then bind that data to the newTicket parameter
*/
    {
        // Print out the ticket data
        Console.WriteLine($"Received ticket: {newTicket.Description}");
        //The equivalent to : console.log(`Received ticket: ${newTicket.Description}`)
        //However, where JS defaults to logging in the browser, C# defaults to logging in the terminal where the app is executed

        // Return a simple message for now
        return Ok(new { Message = "Ticket received successfully!" });
        /*
        Ok() is a method that creates and returns an OkObjectResult object, which represents an HTTP 200 response. 
        This object contains the response data that will be sent back to the client. The .NET framework then uses this object to actually send the response.
        So, alternatively, we could assign this object to a variable before the return statement, and then return that variable.
        Optionally, you can pass it a paramter that will be serialized into JSON, which will be the body of the response
        Here, we are creating an anonymous object with the 'new' keyword.
        Normally, in c#, we would have to use a class to declare the type of the object, but here, we don't need to.
        However, an anonymous object is read-only and cannot be accessed outside of this method or outside of a class (among other limitations)
        */

    }
}

