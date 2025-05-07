# CMSI 662 Secure Software Development: Homework #5
> By Victor Esteban

## Learning Objectives
This assignment demonstrates: 
- An understanding of Web Security principles
- Familiarity with OWASP, especially with its guides and its cheatsheets
- The ability to construct a web server secure from XSS attacks
- The ability to employ CSRF protection in a primitive web server
- The ability to prevent SQL Injection
- Some basic database skills
- The application of validation and fail-fast to a web app


## Project Structure
```
.
├── db
│   ├── accounts.js
|   ├── users.js
│   └── sqlite.js
├── public
│   ├── dashboard.css
│   ├── login.css
│   └── transfer.css
├── services
│   ├── sharesServices.js
│   └── userServices.js
├── views
│   ├── dashboard.ejs
│   ├── login.ejs
│   └── transfer.ejs
└── index.js
```

- `db` directory - Initialize and populates sqlite3 database
- `public` directory - CSS Styling 
- `services` directory - Service Functions
- `views` directory - EJS HTML Templates
- `index.js` file - Server Endpoints

## LMU Stocks

### Login Page
<img align="center" src="https://github.com/victoresteban295/CMSI_662_HW5/blob/main/images/readme/loginpage.png" />

### Features
- Homepage for logged-out users
- Username and Password are required to login
- Entering the wrong username or password will alert users

### Dashboard Page
<img align="center" src="https://github.com/victoresteban295/CMSI_662_HW5/blob/main/images/readme/dashboardpage.png" />

### Features
- Display total value of shares in USD
- Display number of shares owned and the value per share
- The "Transfer" button redirects users to the transfer page

### Transfer Page
<img align="center" src="https://github.com/victoresteban295/CMSI_662_HW5/blob/main/images/readme/transferpage.png" />

### Features
- Account Id of user receiving shares is required 
- Number of Shares to transfer is required
- Prevents the transfer of shares the exceed available amount 

