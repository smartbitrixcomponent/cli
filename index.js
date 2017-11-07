#!/usr/bin/env node
const prompt = require('commander');
const fs = require('fs');
const sh = require('shelljs');

const lockfile = 'smatrix.lock';
const github = require('github-download');

prompt.version('0.0.4');
prompt.option('-a, --all', 'Update all core files and gulp config. Use with UPDATE');

const cwd = sh.pwd();
const baseDir = cwd.stdout;
const lockfilePath = `${baseDir}/${lockfile}`;

prompt.command('init')
  .description('init project')
  .action(() => {
    console.log('start...');
    fs.exists(lockfilePath, (exists) => {
      if (exists) {
        console.log('Your project allready initialized');
      } else {
        // Забираем ядро php из пакета и создаем файл smatrix.lock для проекта
        github({ user: 'smartbitrixcomponent', repo: 'smatrix-core', ref: 'master' }, `${baseDir}/tmp`)
          .on('error', (err) => {
            console.error(err);
          })
          .on('end', () => {
            console.log('Success!');
            sh.cp('-r', `${baseDir}/tmp/*`, baseDir);
            sh.cp('-r', `${baseDir}/tmp/.*`, baseDir);
            sh.rm('-rf', `${baseDir}/tmp`);
          });
        fs.writeFile(lockfilePath, '', (err) => {
          if (err) console.log('Error');
        });
      }
    });
  });

prompt.command('update')
  .description('Update core')
  .action(() => {
    console.log('💻   Update...');
    github({ user: 'smartbitrixcomponent', repo: 'smatrix-core', ref: 'master' }, `${baseDir}/tmp`)
      .on('error', (err) => {
        console.error(err);
      })
      .on('end', () => {
        console.log('Success!');
        sh.cp('-r', `${baseDir}/tmp/local/core/`, `${baseDir}/local/`);
        sh.cp('-r', `${baseDir}/tmp/local/helpers/`, `${baseDir}/local/`);
        if (prompt.all) {
          sh.cp('-r', `${baseDir}/tmp/gulpfile.js`, baseDir);
          sh.cp('-r', `${baseDir}/tmp/package.json`, baseDir);
        }
        sh.rm('-rf', `${baseDir}/tmp`);
      });
    fs.writeFile(lockfilePath, '', (err) => {
      if (err) console.log('Error');
    });
  });

prompt.command('create [namespace:component] [template]')
  .description('create component template')
  .action((cmd, option) => {
    console.log(cmd, option);
  });

prompt.parse(process.argv);
