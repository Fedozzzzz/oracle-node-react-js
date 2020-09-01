const express = require('express');
const crypto = require("crypto");
const router = express.Router();
const oracledb = require('oracledb');
const {doReleaseConnection, getConnectionFromOracle} = require('../../oracle/index');


router.post('/login', async (req, res) => {
    const connection = await getConnectionFromOracle();
    try {
        const {email, password} = req.body;

        const queryResult = await connection.execute(`select *
                                                  from users where email=:email `, [email], {outFormat: oracledb.OBJECT});

        const user = queryResult.rows[0];
        if (!user || !isValidPassword(user, password)) {
             return res.status(HTTPStatus.UNAUTHORIZED).send({error:'incorrect email or password'});
        }
        res.status(HTTPStatus.OK).send({ok:true});
    } catch (e) {
        console.error('error', e);
        res.status(HTTPStatus.CONFLICT).send({error: 'Error while login'});
    } finally {
        await doReleaseConnection(connection);
    }
});

function isValidPassword(user, password) {
    return encryptPassword(password, user.SALT) === user.PASSWORD;
}

function encryptPassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 1, 128, "sha512").toString("hex");
}

module.exports=router;