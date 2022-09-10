import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).
  option('enableSourceMap', {
    alias: 's',
    type: 'boolean',
    description: 'Generate source map files',
    default: false
  }).
  option('enableMinification', {
    alias: 'm',
    type: 'boolean',
    description: 'Enable source minification',
    default: true
  }).
  option('mergeOutput', {
    alias: 'o',
    type: 'boolean',
    description: 'Merge output files',
    default: false
  }).
  option('enableChecksumSupport', {
    alias: 'c',
    type: 'boolean',
    description: 'Enable checksum support',
    default: true
  }).
  parse();

globalThis.enableMinification = argv.enableMinification;
globalThis.enableChecksumSupport = argv.enableChecksumSupport;
globalThis.enableSourceMap = argv.enableSourceMap;
globalThis.mergeOutput = argv.mergeOutput;
