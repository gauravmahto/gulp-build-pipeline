import gulp from 'gulp';
import rename from 'gulp-rename'
import gulpSourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import gulpif from 'gulp-if';
import debug from 'gulp-debug';
import { deleteAsync } from 'del';

import { FilterFiles } from './filter-files.js';
import logger from './logger.js'
import { readGlobalState } from './utils.js';

import { srcGlob, destPath as defaultDistPath } from '../global.js';

const { src, dest, watch, series } = gulp;
const { init, write } = gulpSourcemaps;

export const enableSourceMap = readGlobalState('enableSourceMap');
export const enableMinification = readGlobalState('enableMinification');
export const mergeOutput = readGlobalState('mergeOutput');
export const enableChecksumSupport = readGlobalState('enableChecksumSupport');
export const appendChecksum = readGlobalState('appendChecksum');
export const srcPathGlob = readGlobalState('srcPathGlob');
export const srcPathGlobs = readGlobalState('srcPathGlobs');

const destPath = readGlobalState('destPath');

const babelPresets = [];

if (enableMinification) {

  babelPresets.push('minify');

}

export function cleanTask() {

  return deleteAsync([
    defaultDistPath
  ]);

}

export function babelTask() {

  return src(srcPathGlobs ?? srcPathGlob ?? srcGlob)
    .pipe(gulpif(enableChecksumSupport, new FilterFiles({ appendChecksum })))
    .pipe(gulpif(enableMinification, rename(path => {
      path.basename += '.min'
    })))
    .pipe(gulpif(enableSourceMap, init()))
    .pipe(babel({
      presets: babelPresets
    })
      .on('error', function (error) {

        const { code, fileName } = error;
        logger.error(`Minification failed for file ${fileName} with error code ${code}`);

        this.emit('end');

      }))
    .pipe(gulpif(mergeOutput, concat('_output.js')))
    .pipe(gulpif(enableSourceMap, write('.')))
    .pipe(dest(destPath ?? defaultDistPath))
    .pipe(debug({ title: 'Minified' }));

}

export function watchBabelTask() {

  watch(srcPathGlobs ?? srcPathGlob ?? srcGlob, series(babelTask));

}
