module.exports = {
    user: process.env.ORACLE_USER || "FEDOR",
    password: process.env.ORACLE_PASSWORD || "123456",
    connectString: process.env.ORACLE_CONNECT_STRING || "localhost:1521"
};
