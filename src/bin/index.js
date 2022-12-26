#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { project, ProjectType } = require('../lib/project');
const { system } = require('../lib/system');
const chalk = require('chalk');

const _g = chalk.green;
const _r = chalk.reset;
const _red = chalk.red;

yargs(hideBin(process.argv))
  .scriptName(_g('scrypt'))
  .usage('Usage: $0 <command> [options]')
  .strictCommands()
  .strictOptions()

  // https://github.com/yargs/yargs/issues/199
  // https://github.com/yargs/yargs/blob/master/locales/en.json
  .updateStrings({
    'Missing required argument: %s': {
      one: _red('Missing required argument: %s'),
    },
    'Unknown argument: %s': {
      one: _red('Unknown argument: %s'),
    },
    'Unknown command: %s': {
      one: _red('Unknown command: %s'),
    },
    'Invalid values:': _red('Invalid values:'),
    'Argument: %s, Given: %s, Choices: %s': _red(
      `%s was %s. Must be one of: %s.`
    ),
  })
  .demandCommand(1, _red('Please provide a command.'))

  .command(
    ['project [name]', 'proj [name]', 'p [name]'],
    'Create a new smart contract project',
    //{
    //  name: { demand: true, string: true, hidden: true }
    //},
    (y) => {
        return y.option('statefull', {
            description: 'Create statefull smart contract project.',
            required: false,
            type: 'boolean'
        })
        .alias('state', 'statefull')
        .option('library', {
            description: 'Create library project.',
            required: false,
            type: 'boolean'
        })
        .alias('lib', 'library')
        .positional('name', { demand: true, string: true, hidden: true });
    },
    async (argv) => {
      if (argv.statefull) {
        await project(ProjectType.StatefullContract, argv)
      } else if (argv.library) {
        await project(ProjectType.Library, argv)
      } else {
        await project(ProjectType.Contract, argv)
      }
    }
  )
  .command(['system', 'sys', 's'], 'Show system info', {}, () => system())
  .alias('h', 'help')
  .alias('v', 'version')

  .epilog(
    // _r is a hack to force the terminal to retain a line break below
    _r(
      `
  ___  / __|  _ _   _  _   _ __  | |_ 
 (_-< | (__  | '_| | || | | '_ \ |  _|
 /__/  \___| |_|    \_, | | .__/  \__|
                    |__/  |_|         
   
             sCrypt CLI
      `
    )
  ).argv;
