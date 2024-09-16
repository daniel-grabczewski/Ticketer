export const environment = {
  production: false,
  baseURL: 'http://localhost:5202/api'
};

/*
Technically, you can get away with not using /api while working in development mode. Since usually the front and backend are running on their own local servers with different ports e.g. 4200 for front end and 5202 for backend. So, naturrally, for example, http://localhost:4200/tickets will already do something different than http://localhost:5202/tickets.

So technically, you could just change http://localhost:5202/api/tickets to http://localhost:5202/tickets (and it will still won't conflict with http://localhost:4200/tickets) across frontend and backend, and everything would still work. The /api is simply there is make it more obvious / add clarity to the fact that these urls are used for interacting with the backend. Since reading the /api for differentation is easer than reading the different localhost ports (e.g. 4200 or 5202) for differentiation.
*/