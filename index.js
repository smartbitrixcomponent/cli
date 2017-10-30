#!/usr/bin/env node
const prompt = require('commander');
const fs = require('fs');
const sh = require("shelljs");
const lockfile = 'smatrix.lock';
const github = require('github-download')

prompt.version('0.1.0')
    .option('init', 'Init project')
    .option('create', 'Create component')
    .parse(process.argv);
let cwd = sh.pwd();
const __DIR__ = cwd.stdout;
const lockfilePath = __DIR__ + '/' + lockfile;
if (prompt.create) console.log(prompt.args);

if (prompt.init) {
    fs.exists(lockfilePath, exists => {
        if(exists) {
            console.log('Your project allready initialized');
        } else {
            // Забираем ядро php из пакета и создаем файл smatrix.lock для проекта
            github({user: 'smartbitrixcomponent', repo: 'smatrix-core', ref: 'master'}, __DIR__ + "/tmp")
            .on('error', function(err) {
                console.error(err)
            })
            .on('end', () => {
                console.log('Success!');
                sh.cp('-R', __DIR__ + '/tmp/*', __DIR__);
                sh.rm('-rf', __DIR__ + '/tmp');
            });
            fs.writeFile(lockfilePath, "", err => {if(err) console.log('Error');});

        }
    });
}
