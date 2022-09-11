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
  option('appendChecksum', {
    alias: 'a',
    type: 'boolean',
    description: 'Append checksum data to the checksum file',
    default: false
  }).
  option('srcPathGlob', {
    alias: 'srcG',
    type: 'string',
    description: 'The absolute path globs of the source files directory to minify',
    normalize: true
  }).
  option('srcPathGlobs', {
    alias: 'srcGs',
    type: 'array',
    description: 'The array absolute path globs of the source files directory to minify',
    normalize: true
  }).
  option('destPath', {
    alias: 'dest',
    type: 'string',
    description: 'The absolute path of the destination put of the minified files',
    normalize: true
  }).
  parse();

globalThis.enableMinification = argv.enableMinification;
globalThis.enableChecksumSupport = argv.enableChecksumSupport;
globalThis.appendChecksum = argv.appendChecksum;
globalThis.enableSourceMap = argv.enableSourceMap;
globalThis.mergeOutput = argv.mergeOutput;
globalThis.srcPathGlob = argv.srcPathGlob;
globalThis.srcPathGlobs = argv.srcPathGlobs;
globalThis.destPath = argv.destPath;
