import { createWriteStream, readFileSync } from 'node:fs'
import { EOL } from 'node:os';

export function createWriteChecksumFileStream(filePath) {

  return createWriteStream(filePath, { autoClose: true });

}

export function endTheWriteChecksumFileStream(writeStream) {

  writeStream.end();

}

export function readChecksumFile(filePath) {

  let data;

  try {

    data = readFileSync(filePath, { encoding: 'utf-8' });

  } catch {
    // noop
  }

  return Object.fromEntries(data?.
    split(EOL)?.
    map(value => value.split(' ')).
    filter(arr => arr.length === 2) ?? []);

}
