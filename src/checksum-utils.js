import { createWriteStream, readFileSync } from 'node:fs'
import { EOL } from 'node:os';

import logger from './logger.js'

export function createWriteChecksumFileStream(filePath, append = false) {

  const options = { autoClose: true };

  if (append) {

    options.flags = 'a';

  }

  return createWriteStream(filePath, options)
    .on('error', function (err) {

      logger.error('Checksum file create/open error:', err.message);

    });

}

export function endTheWriteChecksumFileStream(writeStream) {

  writeStream.end();

}

export function readChecksumFile(filePath) {

  let data;

  try {

    data = readFileSync(filePath, { encoding: 'utf-8' });

  } catch (err) {

    logger.error(`Error reading checksum file: ${err.message}`);

  }

  return Object.fromEntries(data?.
    split(EOL)?.
    map(value => value.split(' ')).
    filter(arr => arr.length === 2) ?? []);

}
