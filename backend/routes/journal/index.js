const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const {doReleaseConnection, getConnectionFromOracle} = require('../../oracle/index');
const {formatDate} = require("../../utils");

const OPTIONS_INSERT = {
    autoCommit: true,
    bindDefs: [
        {type: oracledb.NUMBER},
        {type: oracledb.NUMBER},
        {type: oracledb.TIMESTAMP},
        {type: oracledb.TIMESTAMP},
        {type: oracledb.TIMESTAMP},
        {type: oracledb.TIMESTAMP},
    ]
};

router.get('/', async (req, res) => {
    const connection = await getConnectionFromOracle();
    try {
        const journal = await connection.execute(`select clients.id as client_id,
                                                         books.id   as book_id,
                                                         FIRST_NAME,
                                                         LAST_NAME,
                                                         PATHER_NAME,
                                                         NAME       as book_name,
                                                         DATE_BEG,
                                                         DATE_RET,
                                                         DATE_END,
                                                         JOURNAL.ID
                                                  from journal
                                                           join BOOKS on JOURNAL.BOOK_ID = BOOKS.ID
                                                           join CLIENTS on JOURNAL.CLIENT_ID = CLIENTS.ID`, [], {outFormat: oracledb.OBJECT});
        const result = {
            journal: journal.rows
        };
        res.status(HTTPStatus.OK).send(result);
    } catch (e) {
        console.error('error', e);
        res.status(HTTPStatus.CONFLICT).send({error: 'Error while fetching journal data'});
    } finally {
        await doReleaseConnection(connection);
    }
});

router.post('/add', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromOracle();
        const {bookId, clientId, dateBeg, dateEnd, dateRet = null} = req.body;

        const result = await connection.execute(`insert into journal (book_id, client_id, date_beg, date_end, date_ret)
                                                 values (:bookId,
                                                         :clientId,
                                                         to_timestamp(:dateBeg, 'YYYY-MM-DD HH24:MI:SS'),
                                                         to_timestamp(:dateEnd, 'YYYY-MM-DD HH24:MI:SS'),
                                                         null)`,
            {
                bookId,
                clientId,
                // dateBeg,
                // dateEnd,
                // dateRet
                dateBeg: formatDate(dateBeg),
                dateEnd: formatDate(dateEnd),
                // dateRet: formatDate(dateRet)
            }, OPTIONS_INSERT);
        // ${dateRet ? "to_timestamp(:dateRet, 'YYYY-MM-DD HH24:MI:SS')" : 'null'})
        res.status(HTTPStatus.OK).send(result);
    } catch (e) {
        console.error('error', e);
        res.status(HTTPStatus.CONFLICT).send({error: 'Error while creating journal note'});
    } finally {
        await doReleaseConnection(connection);
    }
});

router.delete('/delete', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromOracle();
        const {journalRowId} = req.body;

        const result = await connection.execute(`delete
                                                 from journal
                                                 where id = :id`, [journalRowId], {autoCommit: true});

        res.status(HTTPStatus.OK).send(result);
    } catch (e) {
        console.error('error', e);
        res.status(HTTPStatus.CONFLICT).send({error: 'Error while journal note'});
    } finally {
        await doReleaseConnection(connection);
    }
});

router.put('/edit', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromOracle();
        const {journalRowId, dateRet} = req.body;

        console.log(journalRowId, dateRet);
        const result = await connection.execute(`update journal
                                                 set
--                                                      book_id=:bookId,
--                                                      client_id=:clientId,
--                                                      date_beg=:dateBeg,
--                                                      date_end=:dateEnd,
                                                    date_ret=to_timestamp(:dateRet, 'YYYY-MM-DD HH24:MI:SS')
                                                 where id = :journalRowId`,
            {journalRowId, dateRet: formatDate(dateRet)}, {autoCommit: true});

        res.status(HTTPStatus.OK).send(result);
    } catch (e) {
        console.error('error', e);
        res.status(HTTPStatus.CONFLICT).send({error: 'Error while updating journal data'});
    } finally {
        await doReleaseConnection(connection);
    }
});


module.exports = router;