const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const {doReleaseConnection, getConnectionFromOracle} = require('../../oracle/index');

const OPTIONS_INSERT = {
    autoCommit: true,
    bindDefs: [
        {type: oracledb.VARCHAR2},
        {type: oracledb.VARCHAR2},
        {type: oracledb.VARCHAR2},
        {type: oracledb.VARCHAR2},
        {type: oracledb.VARCHAR2},
        {type: oracledb.VARCHAR2},
    ]
};

router.get('/', async (req, res) => {
    const connection = await getConnectionFromOracle();
    try {
        const clients = await connection.execute(`select *
                                                  from clients`, [], {outFormat: oracledb.OBJECT});
        const result = {
            clients: clients.rows
        };
        res.status(HTTPStatus.OK).send(result);
    } catch (e) {
        console.error('error', e);
        res.status(HTTPStatus.CONFLICT).send({error: 'Error while fetching clients'});
    } finally {
        await doReleaseConnection(connection);
    }
});

router.post('/add', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromOracle();
        const {firstName, lastName, patherName, passportSeria, passportNum} = req.body;

        const result = await connection.execute(`insert into clients (FIRST_NAME, LAST_NAME, PATHER_NAME, PASSPORT_SERIA, PASSPORT_NUM)
                                                 values (:first_name, :last_name, :pather_name, :passport_seria,
                                                         :passport_num)`,
            [firstName, lastName, patherName, passportSeria, passportNum], OPTIONS_INSERT);

        res.status(HTTPStatus.OK).send(result);
    } catch (e) {
        console.error('error', e);
        res.status(HTTPStatus.CONFLICT).send({error: 'Error while creating client'});
    } finally {
        await doReleaseConnection(connection);
    }
});

router.delete('/delete', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromOracle();
        const {userId} = req.body;

        const result = await connection.execute(`delete
                                                 from clients
                                                 where id = :id`, [userId], {autoCommit: true});

        res.status(HTTPStatus.OK).send(result);
    } catch (e) {
        console.error('error', e);
        res.status(HTTPStatus.CONFLICT).send({error: 'Error while deleting client'});
    } finally {
        await doReleaseConnection(connection);
    }
});

router.put('/edit', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromOracle();
        const {firstName, lastName, patherName, passportSeria, passportNum, clientId} = req.body;

        console.log({firstName, lastName, patherName, passportSeria, passportNum, clientId});

        const result = await connection.execute(`update clients
                                                 set first_name=:firstName,
                                                     last_name=:lastName,
                                                     pather_name=:patherName,
                                                     passport_seria=:passportSeria,
                                                     passport_num=:passportNum
                                                 where id = :clientId`,
            {firstName, lastName, patherName, passportSeria, passportNum, clientId}, {autoCommit: true});

        res.status(HTTPStatus.OK).send(result);
    } catch (e) {
        console.error('error', e);
        res.status(HTTPStatus.CONFLICT).send({error: 'Error while updating client data'});
    } finally {
        await doReleaseConnection(connection);
    }
});

router.post('/get_client_books', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromOracle();
        const {clientId} = req.body;

        const queryResult = await connection.execute(`select count(*)
                                                      from books
                                                               join journal on (books.id = journal.book_id)
                                                               join clients on (clients.id = journal.client_id)
                                                      where clients.id = :clientId
                                                        and JOURNAL.DATE_RET is null`, [clientId]);

        const result = {
            clientBooksCount: queryResult.rows[0][0]
        };
        res.status(HTTPStatus.OK).send(result);
    } catch (e) {
        console.error('error', e);
        res.status(HTTPStatus.CONFLICT).send({error: 'Error while getting client books count'});
    } finally {
        await doReleaseConnection(connection);
    }
});

router.post('/get_client_fine', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromOracle();
        const {clientId} = req.body;

        const queryResult = await connection.execute(`select sum(fine * interval_to_days(date_ret - date_end))
                                                      from book_types
                                                               join books on (book_types.id = books.type_id)
                                                               join journal on (books.id = journal.book_id)
                                                               join clients on (clients.id = journal.client_id)
                                                      where clients.id = '2'
                                                        and journal.DATE_RET > journal.date_end`, [clientId]);
        const result = {
            clientFine: queryResult.rows[0][0]
        };

        res.status(HTTPStatus.OK).send(result);
    } catch (e) {
        console.error('error', e);
        res.status(HTTPStatus.CONFLICT).send({error: 'Error while getting client fine'});
    } finally {
        await doReleaseConnection(connection);
    }
});


module.exports = router;