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

function githubAuth(callback) {
    getGithubToken(function(err, token) {
        if (err) {
            return callback(err);
        }
        github.authenticate({
            type: 'oauth',
            token: token
        });
        return callback(null, token);
    });
}

function getGithubToken(callback) {
    var prefs = new Preferences('minilog');

    if (prefs.github && prefs.github.token) {
        return callback(null, prefs.github.token);
    }

    // Fetch token
    getGithubCredentials(function(credentials) {
        var loader = new Spinner('talking to github, please wait...');
        //loader.start();
        github.authenticate(
            _.extend({
                    type: 'basic',
                },
                credentials
            )
        );
        console.log("here")
        github.authorization.create({
            scopes: ['user', 'public_repo', 'repo', 'repo:status'],
            note: 'minilog, minimalism command line tool for logging'
        }, function(err, res) {
            //loader.stop();
            if (err) {
                return callback(err);
            }
            if (res.token) {
                prefs.github = {
                    token: res.token
                };
                return callback(null, res.token);
            }
            return callback();
        });

    });
}

function getGithubCredentials(callback) {
    var questions = [{
            name: 'username',
            type: 'input',
            message: 'Enter your Github username or e-mail address:',
            validate: function(value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your username or e-mail address';
                }
            }
        },
        {
            name: 'password',
            type: 'password',
            message: 'Enter your password:',
            validate: function(value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your password';
                }
            }
        }
    ];

    inquirer.prompt(questions).then(callback);
}

// githubAuth(function(err, authed) {
            //     if (err) {
            //         switch (err.code) {
            //             case 401:
            //                 console.log(chalk.red('Couldn\'t log you in. Please try again.'));
            //                 break;
            //             case 422:
            //                 console.log(chalk.red('You already have an access token.'));
            //                 break;
            //         }
            //     }
            //     if (authed) {
            //         console.log(chalk.green('Sucessfully authenticated!'));
            //         // createRepo(function(err, url) {
            //         //     if (err) {
            //         //         console.log('An error has occured');
            //         //     }
            //         //     if (url) {
            //         //         createGitignore(function() {
            //         //             setupRepo(url, function(err) {
            //         //                 if (!err) {
            //         //                     console.log(chalk.green('All done!'));
            //         //                 }
            //         //             });
            //         //         });
            //         //     }
            //         // });
            //     }
            // });
var login = {
    loginGithub: getGithubCredentials
}
module.exports = login