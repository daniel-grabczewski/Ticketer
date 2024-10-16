## Prerequisites
- **Node.js**: Make sure the latest LTS version of Node.js is installed. You can download it [here](https://nodejs.org/).
- **.NET SDK**: Ensure you have the latest LTS version of .NET SDK installed. You can download it [here](https://dotnet.microsoft.com/en-us/download/dotnet).
- **MySQL**: Ensure MySQL is installed and running. You can download it [here](https://dev.mysql.com/downloads/installer/).

## Install front end dependencies
Navigate to **/frontend** in your terminal

- Run `npm install` to install node packages
- Run `npm install -g @angular/cli` to install the Angular Command Line Interface
- Run `ng add @angular/material` to install Angular's Material UI library

## Configuration files
- Rename `appsettings.json.example` to `appsettings.json` in **/backend**
- In that file, replace `<YOUR PASSWORD>` with the password you set for your MySQL root account.

- Rename `environment.ts.example` to `environment.ts` in **/frontend/src/environments** 
- In that file, replace `<YOUR AUTH0 DOMAIN>`, `<YOUR AUTH0 CLIENT ID>`, and `<YOUR AUTH0 AUDIENCE>` with the matching fields from your Auth0 configuration.

## Build database
Navigate to **/backend** in your terminal

Confirm you have the following donet packages:
- `MySql.EntityFrameworkCore`
- `Microsoft.EntityFrameworkCore.Design`

If not, run the following commands:
- `dotnet add package MySql.EntityFrameworkCore`
- `dotnet add package Microsoft.EntityFrameworkCore.Design`

Next, to build the database, run the following commands:
- **Create migrations** `dotnet ef migrations add InitialCreate`
- **Build database** `dotnet ef database update`


## Development server
Navigate to **/frontend** in your terminal
- Run `ng serve` for a dev server.
- Navigate to `http://localhost:4200/` in your browser.
- The application will automatically reload if you change any of the source files.

Navigate to **/backend** in your terminal
- Run `dotnet watch run` for the backend dev server. This will run on `http://localhost:5202/`
- The application will automatically reload if you change any of the source files.


