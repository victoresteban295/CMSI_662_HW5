const db = require("../db/sqlite");

const getShares = (email, callback) => {
    const query = 'SELECT shares, funds FROM accounts WHERE owner = ?';

    db.get(query, [email], (err, row) => {
        if (err) {
            return callback(err);
        }
        if (!row) { //No Account Found
            return callback(null, null);
        }

        return callback(null, { shares: row.shares, funds: row.funds });
    })
}

const transferShares = (sourceEmail, targetAccountId, shareAmount, callback ) => {
    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        //Get Source Account
        db.get(
            `SELECT shares FROM accounts WHERE owner = ?`,
            [sourceEmail],
            (err, sourceRow) => {
                if (err) {
                    db.run("ROLLBACK");
                    return callback(err);
                }

                if (!sourceRow || sourceRow.shares < shareAmount) {
                    db.run("ROLLBACK");
                    return callback(new Error("Insufficient Shares or Invalid Source Account"));
                }

                //Get Target Account
                db.get(
                    `SELECT shares FROM accounts WHERE id = ?`,
                    [targetAccountId],
                    (err, targetRow) => {
                        if (err) {
                            db.run("ROLLBACK");
                            return callback(err);
                        }

                        if(!targetRow) {
                            db.run("ROLLBACK");
                            return callback(new Error("Invalid Target Account"));
                        }

                        //Update Source & Target Account
                        const updateSource = `UPDATE accounts SET shares = shares - ? WHERE owner = ?`;
                        const updateTarget = `UPDATE accounts SET shares = shares + ? WHERE id = ?`;

                        db.run(updateSource, [shareAmount, sourceEmail], function (err) {
                            if (err) {
                                db.run("ROLLBACK");
                                return callback(err);
                            }

                            db.run(updateTarget, [shareAmount, targetAccountId], function (err) {
                                if (err) {
                                    db.run("ROLLBACK");
                                    return callback(err);
                                }

                                db.run("COMMIT");
                                return callback(null, "Transfer Successful");
                            });
                        });
                    }
                );
            }
        );
    });
}

module.exports = {
    getShares, 
    transferShares
}