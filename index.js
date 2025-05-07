require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { getUserWithCredentials, loggedIn } = require('./services/userService');
const { getShares, transferShares } = require('./services/sharesService');


//Initializing Database
require('./db/users');
require('./db/accounts');

const app = express();
const port = 3000;

app.set('view engine', 'ejs'); //Setup EJS
app.set('views', path.join(__dirname, "views")); //Templates Directory
app.use(express.urlencoded({ extended: true })); //Access HTML Form Data
app.use(cookieParser()); //Access Cookies
app.use(express.static("public")); //CSS Directory

app.get('/', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    getUserWithCredentials(email, password, (err, user) => {
        if (err) return res.status(500).send("Server Error");
        if (!user) {
            return res.status(401).render('login', { error: "Invalid Username/Password"}); //User Enumeration Defense
        }

        //Protect From XSS Attacks By Setting httpOnly to true
        res.cookie("auth_token", user.token, { httpOnly: true });
        res.redirect(303, "/dashboard");
    });
});


app.get('/dashboard', loggedIn, (req, res) => {
    if (!req.user) { //User Not Authenticated
        return res.redirect("/");
    }
    const email = req.user;

    getShares(email, (err, result) => {
        if (err || !result) {
            return res.status(401).render('login', { error: "Invalid Account"});
        } else {
            const shares = result.shares;
            const fundsInCents = result.funds;

            
            const valueInCents = shares * 314; //Fixed Share Value
            const sharesValue = (valueInCents / 100).toFixed(2);
            const funds = (fundsInCents / 100).toFixed(2);
    
            res.render('dashboard', { sharesValue, shares, funds });
        }
    });
});

app.get("/transfer", loggedIn, (req, res) => {
    if (!req.user) { //User Not Authenticated
        return res.redirect("/");
    }
    res.render("transfer", { error: null });
});

app.post("/transfer", loggedIn, (req, res) => {
    if (!req.user) { //User Not Authenticated
        return res.redirect("/");
    }

    const sourceEmail = req.user;
    const targetAccountId = req.body.targetAccountId;
    const shareAmount = req.body.shareAmount;
    

    transferShares(sourceEmail, targetAccountId, shareAmount, (err, message) => {
        if (err) {
            return res.status(401).render('transfer', { error: err.message});
        } else {
            res.redirect(303, "/dashboard");
        }
    }); 
    
});

app.get("/logout", (req, res) => {
    res.clearCookie("auth_token");
    res.redirect(303, "/dashboard");
});


app.listen(port, () => {
    console.log(`Server runnning at http://localhost:${port}`);
});