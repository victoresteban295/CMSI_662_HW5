const sqlite3 = require("sqlite3").verbose();
const path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db/sqlite');


//HIDE BEFORE PUSHING CODE TO GITHUB
const SECRET = process.env.SECRET_KEY;

//Verify Password
const verifyPBKDF2 = (password, storedHash) => {
    const [salt, originalHash] = storedHash.split("$");
    if (!salt || !originalHash) return false;
    const derivedHash = crypto.pbkdf2Sync(password, salt, 100_000, 64, "sha256").toString("hex");
    return crypto.timingSafeEqual(
        Buffer.from(derivedHash, "hex"),
        Buffer.from(originalHash, "hex")
    );
}

const getUserWithCredentials = (email, password, callback) => {
    const query = "SELECT email, name, password FROM users WHERE email = ?";

    db.get(query, [email], (err, row) => {
        //Error Connecting to DB
        if (err) {
            return callback(err);
        }

        //No User Found
        if (!row) {
            return callback(null, null);
        }

        const { email, name, password: hashPassword } = row;
        //Invalid Credentials
        if (!verifyPBKDF2(password, hashPassword)) {
            return callback(null, null);
        //Valid Credentials
        } else {
            const token = createToken(email);
            return callback(null, { email, name, token });
        }
    });
}


const loggedIn = (req, res, next) => {
    const token = req.cookies.auth_token;
    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded.sub;
        return next();
    } catch(err) {
        req.user = null;
        return next();
    }
}

const createToken = (email) => {
    const payload = {
        sub: email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60), //Expires in 1 Hr
    };

    return jwt.sign(payload, SECRET, { algorithm: "HS256" }); //Sign & Return JWT
}

module.exports = {
    getUserWithCredentials,
    loggedIn, 
    createToken
};