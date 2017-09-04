#!/usr/bin/env node

var chalk = require('chalk');
var clear = require('clear');
var CLI = require('clui');
var figlet = require('figlet');
var inquirer = require('inquirer');
var Preferences = require('preferences');
var Spinner = CLI.Spinner;
var _ = require('lodash');
var touch = require('touch');
var fs = require('fs');
var path = require("path");
var random = require("random-id");
require('console.table');
var login = require('./modules/login.js');



function parseArguments() {
    var filePath = path.join(__dirname, 'log.json'),
        argvObj = require('minimist')(process.argv.slice(2)),
        optionObj = _.omit(argvObj, "_");

    if (argvObj._.length == 1) {
        clear();
        console.log(
            chalk.yellow(
                figlet.textSync('MINI LOG', { horizontalLayout: 'full' })
            )
        );
        switch (argvObj._[0]) {
            case "login":
                login.loginGithub(function() {
                    console.log(arguments)
                })

                break;
            case "list":
                fs.readFile(filePath, 'utf8', function(err, data) {
                    if (err) {
                        throw err;
                    } else {
                        console.table(JSON.parse(data))
                    }
                    //Do your processing, MD5, send a satellite to the moon, etc.
                });
                break;
        }
    } else if (!_.isEmpty(optionObj)) {
        logEntry(optionObj)
    }
}

function logEntry(optionObj) {
    var entry = {}
    if (optionObj["t"]) {
        entry["label"] = "try";
        entry["message"] = optionObj["t"]
    } else if (optionObj["s"]) {
        entry["label"] = "success";
        entry["message"] = optionObj["s"]
    } else if (optionObj["f"]) {
        entry["label"] = "fail"
        entry["message"] = optionObj["f"]
    } else if (optionObj["i"]) {
        entry["label"] = "idea";
        entry["message"] = optionObj["i"]
    }
    entry.id = random();
    entry.timeStamp = new Date();
    readOrCreateFile(entry, writeToFile)

}

function readOrCreateFile(entry, callback) {
    var data = [],
        filePath = path.join(__dirname, 'log.json');
    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, 'utf8', function(err, data) {
            if (err) {
                throw err;
            } else {
                data = JSON.parse(data);
                data.push(entry);
                callback(data)
            }
        });
    } else {
        touch("log.json");
        data.push(entry);
        callback(data)
    }
}

function writeToFile(data) {
    fs.writeFile("./log.json", JSON.stringify(data), 'utf-8', function(err) {
        if (err) throw err;
        console.log('complete');
    });

}

//parseArguments();
console.log(process)