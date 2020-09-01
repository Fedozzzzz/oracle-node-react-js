const fsp = require("fs").promises;
const path = require("path");
const camelCase = require("camelcase");
const _ = require("lodash");

module.exports = {
    readConfig: async () => {
        const files = await fsp.readdir(__dirname);
        const configurations = files.filter(f => !f.includes("index"));
        const defaultConfig = configurations.reduce((acc, cur) => {
            const configName = cur.split(".")[0];
            const config = require(path.join(__dirname, cur));
            return {...acc, [configName]: config};
        }, {});

        const envConfig = parseEnv();

        return _.merge(defaultConfig, envConfig);
    }
};

function parseEnv() {
    const parameters = Object.keys(process.env);
    const env = {};
    parameters.forEach(parameter => {
        const parsed = parseEnvParameter(parameter);
        if (!parsed) return;

        const {namespace, name} = parsed;
        const value = tryParseEnvValue(process.env[parameter]);
        if (!env[namespace]) env[namespace] = {};

        env[namespace][name] = value;
    });

    return env;
}

const PARAMETER_DELIMITER = "__";
const CAMELCASE_DELIMITER = "_";

function parseEnvParameter(parameter) {
    if (parameter.indexOf(PARAMETER_DELIMITER) < 0) return;

    const parts = parameter.split(PARAMETER_DELIMITER);
    const namespace = parts[0];
    const name = parts.splice(1).join(CAMELCASE_DELIMITER);

    return {
        namespace: camelCase(namespace),
        name: camelCase(name)
    };
}

function tryParseEnvValue(value) {
    try {
        return JSON.parse(value);
    } catch (e) {
        return value;
    }
}
