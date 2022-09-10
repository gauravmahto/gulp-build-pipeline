import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Transform } from 'node:stream';
import { EOL } from 'node:os';

import { createWriteChecksumFileStream, endTheWriteChecksumFileStream, readChecksumFile } from './checksum-utils.js';
import { calculateChecksum, isNonEmptyObject } from './utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcRoot = join(__dirname, '..');

const checksumFilePath = join(srcRoot, '.checksum');

export class FilterFiles extends Transform {

  #checksumData;
  #fileStream;

  constructor(options = {}) {

    super({ objectMode: true, ...options });

    this.#checksumData = readChecksumFile(options.checksumFilePath ?? checksumFilePath);
    this.#fileStream = createWriteChecksumFileStream(options.checksumFilePath ?? checksumFilePath);

  }

  _transform(chunk, enc, callback) {

    const fileName = chunk.history[0];
    const fileChecksum = calculateChecksum(chunk.contents);

    this.#fileStream.write(`${fileName} ${fileChecksum}${EOL}`);

    if (isNonEmptyObject(this.#checksumData)) {

      if (fileChecksum === this.#checksumData[fileName]) {

        return callback();

      }

    }

    this.push(chunk, enc);
    callback();

  }

  _flush(callback) {

    endTheWriteChecksumFileStream(this.#fileStream);
    callback();

  }

}
