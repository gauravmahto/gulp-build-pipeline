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
  option('srcPathGlob', {
    alias: 'srcG',
    type: 'string',
    description: 'The absolute path of the source files directory to minify',
    normalize: true
  }).
  option('distPath', {
    alias: 'dist',
    type: 'string',
    description: 'The absolute path of the destination put of the minified files',
    normalize: true
  }).
  parse();

globalThis.enableMinification = argv.enableMinification;
globalThis.enableChecksumSupport = argv.enableChecksumSupport;
globalThis.enableSourceMap = argv.enableSourceMap;
globalThis.mergeOutput = argv.mergeOutput;
globalThis.srcPathGlob = argv.srcPathGlob;
globalThis.distPath = argv.distPath;
