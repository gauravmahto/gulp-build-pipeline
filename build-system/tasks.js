import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import gulp from 'gulp';
import rename from 'gulp-rename'
import gulpSourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import gulpif from 'gulp-if';
// import lazypipe from 'lazypipe';
import { deleteAsync } from 'del';

import { readGlobalState } from './utils.js';

const { task, src, dest, series } = gulp;
const { init, write } = gulpSourcemaps;

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcRoot = join(__dirname, '..');

const srcGlob = join(srcRoot, 'src/**/*.js');
const distPath = join(srcRoot, 'dist');

const enableSourceMap = readGlobalState('enableSourceMap');
const enableMinification = readGlobalState('enableMinification');
const mergeOutput = readGlobalState('mergeOutput');

const babelPresets = [];

if (enableMinification) {

  babelPresets.push('minify');

}

task('build:clean', () => {

  return deleteAsync([
    distPath
  ]);

});

task('build:babel', () => {
  return src(srcGlob)
    .pipe(gulpif(enableMinification, rename(path => {
      path.basename += '.min'
    })))
    .pipe(gulpif(enableSourceMap, init()))
    .pipe(babel({
      presets: babelPresets
    }))
    .pipe(gulpif(mergeOutput, concat('_output.js')))
    .pipe(write('.'))
    .pipe(dest(distPath));
});

export default task('default', series(['build:clean', 'build:babel']))
