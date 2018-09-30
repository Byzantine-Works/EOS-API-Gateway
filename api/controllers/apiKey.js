const uuidAPIKey = require('uuid-apikey');
const crypto = require('crypto');

const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");

const init = () => {
    console.log(
        chalk.green(
            figlet.textSync("API KeyGen", {
                font: "Ghost",
                horizontalLayout: "default",
                verticalLayout: "default"
            })
        )
    );
};

const askQuestions = () => {
    const questions = [{
            name: "CLIENTNAME",
            type: "input",
            message: "Enter the name of Client?"
        },
        {
            type: "list",
            name: "APIRATE",
            message: "What sort of api metering is needed?",
            choices: ["0-100k", "100-200k", "200-500k", "500-1000k"],
            filter: function (val) {
                return val.split("-")[1];
            }
        }
    ];
    return inquirer.prompt(questions);
};

const createKeys = (client, apiRate) => {
    var keyset = {};
    var apiKeys = uuidAPIKey.create();
    keyset.apiKey = apiKeys.apiKey;
    keyset.uuidKey = apiKeys.uuid;
    keyset.saltKey = crypto.randomBytes(16).toString('hex');
    console.log("apiKeys => ");
    console.log(keyset);
    return apiKeys;
};

const success = keySet => {
    console.log(
        chalk.white.bgGreen.bold(` Salt + API Keysets created `)
    );
};

const run = async () => {
    init();
    const answers = await askQuestions();
    const {
        CLIENTNAME,
        APIRATE
    } = answers;
    const keySet = createKeys(CLIENTNAME, APIRATE);
    success(keySet);
};

module.exports.keygen = function () {
    run();
}