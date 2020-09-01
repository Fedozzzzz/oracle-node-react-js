const express = require('express');
const HTTPStatus = require("http-status-codes");
const _ = require("lodash");
const {readConfig} = require('../config/index');
const {applyRouter} = require("../routes");

async function setupGlobals() {
    global.config = await readConfig();
    global.HTTPStatus = HTTPStatus;
}

async function runServer() {
    const app = express();

    const port = config.http.port;
    app.listen(port, () => console.log(`Server started on port ${port}`));

    applyRouter(app);

    return app;
}

async function run() {
    await setupGlobals();
    return await runServer();
}

module.exports = {
    run
};
