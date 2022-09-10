import gulp from 'gulp';
import rename from 'gulp-rename'
import gulpSourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import gulpif from 'gulp-if';
import debug from 'gulp-debug';
import { deleteAsync } from 'del';

import { FilterFiles } from './filter-files.js';
import { readGlobalState } from './utils.js';

import { srcGlob, distPath as defaultDistPath } from '../global.js';

const { task, src, dest, series } = gulp;
const { init, write } = gulpSourcemaps;

const enableSourceMap = readGlobalState('enableSourceMap');
const enableMinification = readGlobalState('enableMinification');
const mergeOutput = readGlobalState('mergeOutput');
const enableChecksumSupport = readGlobalState('enableChecksumSupport');
const srcPathGlob = readGlobalState('srcPathGlob');
const distPath = readGlobalState('distPath');

const babelPresets = [];

if (enableMinification) {

  babelPresets.push('minify');

}

task('build:clean', () => {

  return deleteAsync([
    defaultDistPath
  ]);

});

task('build:babel', () => {

  return src(srcPathGlob ?? srcGlob)
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
    .pipe(dest(distPath ?? defaultDistPath))
    .pipe(debug({ title: 'Minified' }));

});

export default task('default', series(['build:clean', 'build:babel']))
