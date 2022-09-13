// Load global config
import './config.js';

import gulp from 'gulp';

import { cleanTask, babelTask } from './src/index.js';

const { series } = gulp;

export { watchBabelTask, cleanTask, babelTask } from './src/index.js';

export default series(cleanTask, babelTask);
