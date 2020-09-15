#!/usr/bin/env node
process.env.NODE_PATH = `${__dirname}/../node_modules/`;
const { resolve } = require('path');
const spawnSync = require('child_process').spawnSync;
const program = require('commander');
const { version } = require('../../package');

const res = (command) => resolve(__dirname, '../CommandScript/', command);

program.version(version);

program.usage('<command>');

program
  .command('upgrade')
  .description('Upgrade your bbk-cli to latest')
  .action(() => {
    const npmCmd = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';
    const paramsUpload = [
      'install',
      '-g',
      'cici-cli-test',
    ];
    spawnSync(npmCmd, paramsUpload, {
      stdio: 'inherit',
    });
  });

program
  .command('create')
  .description('Create a new component')
  .alias('-c')
  .action(() => {
    require(res('Create'));
  });
  
program.parse(process.argv);

if (!process.argv[2]) {
  program.help();
}
