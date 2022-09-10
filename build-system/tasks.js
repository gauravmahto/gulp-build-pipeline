import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import gulp from 'gulp';
import rename from 'gulp-rename'
import gulpSourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import gulpif from 'gulp-if';
import debug from 'gulp-debug';
import { deleteAsync } from 'del';

import { readChecksumFile } from './checksum-utils.js';
import { FilterFiles } from './filter-files.js';
import { readGlobalState } from './utils.js';

const { task, src, dest, series } = gulp;
const { init, write } = gulpSourcemaps;

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcRoot = join(__dirname, '..');

const checksumFilePath = join(srcRoot, '.checksum');

const srcGlob = join(srcRoot, 'src/**/*.js');
const distPath = join(srcRoot, 'dist');

const enableSourceMap = readGlobalState('enableSourceMap');
const enableMinification = readGlobalState('enableMinification');
const mergeOutput = readGlobalState('mergeOutput');
const enableChecksumSupport = readGlobalState('enableChecksumSupport');

const babelPresets = [];

if (enableMinification) {

  babelPresets.push('minify');

}

await readChecksumFile(checksumFilePath);

task('build:clean', () => {

  return deleteAsync([
    distPath
  ]);

});

task('build:babel', () => {

  return src(srcGlob)
    .pipe(gulpif(enableChecksumSupport, new FilterFiles()))
    .pipe(gulpif(enableMinification, rename(path => {
      path.basename += '.min'
    })))
    .pipe(gulpif(enableSourceMap, init()))
    .pipe(babel({
      presets: babelPresets
    }))
    .pipe(gulpif(mergeOutput, concat('_output.js')))
    .pipe(gulpif(enableSourceMap, write('.')))
    .pipe(debug({ title: 'Minified' }))
    .pipe(dest(distPath));

});

export default task('default', series(['build:clean', 'build:babel']))
