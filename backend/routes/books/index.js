const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const {doReleaseConnection, getConnectionFromOracle} = require('../../oracle/index');

router.get('/', async (req, res) => {
    const connection = await getConnectionFromOracle();
    try {
        const books = await connection.execute(`select *
                                                from books`, [], {outFormat: oracledb.OBJECT});
        const result = {
            books: books.rows
        };
        res.status(HTTPStatus.OK).send(result);
    } catch (e) {
        console.error('error', e);
        res.status(HTTPStatus.CONFLICT).send({error: 'Error while fetching books'});
    } finally {
        await doReleaseConnection(connection);
    }
});

const OPTIONS_INSERT = {
    autoCommit: true,
    bindDefs: [
        {type: oracledb.VARCHAR2},
        {type: oracledb.NUMBER},
        {type: oracledb.NUMBER},
    ]
};

router.post('/add', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromOracle();
        const {name, count, typeId} = req.body;

        console.log({name, count, typeId});

        const result = await connection.execute(`insert into books
                                                     (name, count, type_id)
                                                 values (:name, :count, :typeId)`,
            [name, count, typeId], OPTIONS_INSERT);

        res.status(HTTPStatus.OK).send(result);
    } catch (e) {
        console.error('error', e);
        res.status(HTTPStatus.CONFLICT).send({error: 'Error while adding new book'});
    } finally {
        await doReleaseConnection(connection);
    }
});

router.delete('/delete', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromOracle();
        const {bookId} = req.body;

        const result = await connection.execute(`delete
                                                 from books
                                                 where id = :id`, [bookId], {autoCommit: true});

        res.status(HTTPStatus.OK).send(result);
    } catch (e) {
        console.error('error', e);
        res.status(HTTPStatus.CONFLICT).send({error: 'Error while deleting book'});
    } finally {
        await doReleaseConnection(connection);
    }
});

router.put('/edit', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromOracle();
        const {name, count, typeId, bookId} = req.body;

        const result = await connection.execute(`update books
                                                 set name=:name,
                                                     count=:count,
                                                     type_id=:typeId
                                                 where id = :bookId`,
            {name, count, typeId, bookId}, {autoCommit: true});

        res.status(HTTPStatus.OK).send(result);
    } catch (e) {
        console.error('error', e);
        res.status(HTTPStatus.CONFLICT).send({error: 'Error while updating book data'});
    } finally {
        await doReleaseConnection(connection);
    }
});

router.get('/get_books_types', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromOracle();

        const books = await connection.execute(`select *
                                                from books
                                                         left join BOOK_TYPES on BOOKS.TYPE_ID = BOOK_TYPES.ID`, [], {outFormat: oracledb.OBJECT});
        const result = {
            books: books.rows
        };
        res.status(HTTPStatus.OK).send(result);
    } catch (e) {
        console.error('error', e);
        res.status(HTTPStatus.CONFLICT).send({error: 'Error while fetching books'});
    } finally {
        await doReleaseConnection(connection);
    }
});

router.post('/max_days', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromOracle();
        const {bookId} = req.body;

        console.log('req.body', req.body);
        const dayCount = await connection.execute(`select DAY_COUNT
                                                   from books
                                                            join BOOK_TYPES on BOOKS.TYPE_ID = BOOK_TYPES.ID
                                                   where BOOKS.id = :bookId`, {bookId}, {
            outFormat: oracledb.OBJECT,
            maxRows: 1
        });

        const result = {
            dayCount: dayCount.rows[0].DAY_COUNT
        };
        res.status(HTTPStatus.OK).send(result);
    } catch (e) {
        console.error('error', e);
        res.status(HTTPStatus.CONFLICT).send({error: 'Error while fetching books'});
    } finally {
        await doReleaseConnection(connection);
    }
});

router.get('/three_popular_book', async (req, res) => {
    let connection;
    try {
        connection = await getConnectionFromOracle();

        const queryResult = await connection.execute(`select *
                                                      from (select books.id, name, count, count(book_id)
                                                            from books
                                                                     inner join journal on (book_id = books.id)
                                                            group by(books.id, name, count, book_id)
                                                            order by count(journal.book_id)
                                                                desc) where rownum <= 3`, {}, {
            outFormat: oracledb.OBJECT,
        });

        console.log('books', queryResult);
        const result = {
            threePopularBooks: queryResult.rows
        };
        res.status(HTTPStatus.OK).send(result);
    } catch (e) {
        console.error('error', e);
        res.status(HTTPStatus.CONFLICT).send({error: 'Error while fetching three most popular books'});
    } finally {
        await doReleaseConnection(connection);
    }
});


module.exports = router;