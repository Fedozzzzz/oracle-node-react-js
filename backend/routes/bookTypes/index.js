const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const {doReleaseConnection, getConnectionFromOracle} = require('../../oracle/index');

router.get('/', async (req, res) => {
    const connection = await getConnectionFromOracle();
    try {
        const bookTypes = await connection.execute(`select *
                                                  from BOOK_TYPES`, [], {outFormat: oracledb.OBJECT});
        const result = {
            bookTypes: bookTypes.rows
        };
        res.status(HTTPStatus.OK).send(result);
    } catch (e) {
        console.error('error', e);
        res.status(HTTPStatus.CONFLICT).send({error: 'Error while fetching book types'});
    } finally {
        await doReleaseConnection(connection);
    }
});

module.exports = router;