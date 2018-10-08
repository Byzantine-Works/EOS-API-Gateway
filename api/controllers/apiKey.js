const uuidAPIKey = require('uuid-apikey');
const crypto = require('crypto');
const es = require('../es.js');

const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
//const shell = require("shelljs");

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
        }, {
            name: "WEBHOOK",
            type: "input",
            message: "Enter the webhook fully qualified URL?"
        },
        {
            type: "list",
            name: "APIRATE",
            message: "What sort of api metering is needed?",
            choices: ["0-100k", "100-200k", "200-500k", "500-1000k", "0-0"], //0-0 == perpetual license
            filter: function (val) {
                return val.split("-")[1];
            }
        }
    ];
    return inquirer.prompt(questions);
};

const createKeys = (client, apiRate, webhook) => {
    var keyset = {};
    var apiKeys = uuidAPIKey.create();
    keyset.key = apiKeys.apiKey;
    keyset.uuid = apiKeys.uuid;
    keyset.salt = crypto.randomBytes(16).toString('hex');
    keyset.webhook = webhook;
    keyset.name = client;
    keyset.rate = apiRate;
    keyset.nonce = 0;
    console.log("apiKeyset => ");
    console.log(keyset);
    return keyset;
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
        APIRATE,
        WEBHOOK
    } = answers;
    const keySet = createKeys(CLIENTNAME, APIRATE, WEBHOOK);
    success(keySet);
    //persist in es
    es.addApiKey4Keygen(keySet);
};

module.exports.keygen = function () {
    run();
}