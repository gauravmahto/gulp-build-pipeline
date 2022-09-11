import gulp from 'gulp';
import rename from 'gulp-rename'
import gulpSourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import gulpif from 'gulp-if';
import debug from 'gulp-debug';;
import { deleteAsync } from 'del';

import { FilterFiles } from './filter-files.js';
import logger from './logger.js'
import { readGlobalState } from './utils.js';

import { srcGlob, destPath as defaultDistPath } from '../global.js';

const { task, src, dest, series } = gulp;
const { init, write } = gulpSourcemaps;

const enableSourceMap = readGlobalState('enableSourceMap');
const enableMinification = readGlobalState('enableMinification');
const mergeOutput = readGlobalState('mergeOutput');
const enableChecksumSupport = readGlobalState('enableChecksumSupport');
const appendChecksum = readGlobalState('appendChecksum');
const srcPathGlob = readGlobalState('srcPathGlob');
const srcPathGlobs = readGlobalState('srcPathGlobs');

const destPath = readGlobalState('destPath');

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

});

export default task('default', series(['build:clean', 'build:babel']))
