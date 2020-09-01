const oracledb = require('oracledb');

async function getConnectionFromOracle() {
    return await oracledb.getConnection({
        user: config.oracle.user,
        password: config.oracle.password,
        connectString: config.oracle.connectString
    });
}

async function doReleaseConnection(connection) {
    if (connection) {
        try {
            connection.close();
        } catch (err) {
            console.error(err);
        }
    }
}


module.exports = {
    getConnectionFromOracle,
    doReleaseConnection
};