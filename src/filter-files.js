import { Transform } from 'node:stream';
import { EOL } from 'node:os';

import { createWriteChecksumFileStream, endTheWriteChecksumFileStream, readChecksumFile } from './checksum-utils.js';
import { calculateChecksum, isNonEmptyObject } from './utils.js';

import { checksumFilePath as defaultChecksumFilePath } from '../global.js';

export class FilterFiles extends Transform {

  #checksumData;
  #fileStream;
  #appendChecksum;

  constructor({ appendChecksum = false, checksumFilePath = defaultChecksumFilePath, ...options } = {}) {

    super({ objectMode: true, ...options });

    this.#appendChecksum = appendChecksum;

    this.#checksumData = readChecksumFile(checksumFilePath);
    this.#fileStream = createWriteChecksumFileStream(checksumFilePath, appendChecksum);

  }

  _transform(chunk, enc, callback) {

    const fileName = chunk.history[0];
    const fileChecksum = calculateChecksum(chunk.contents);

    if (isNonEmptyObject(this.#checksumData)) {

      if (this.#appendChecksum && !(fileName in this.#checksumData)) {

        this.#fileStream.write(`${fileName} ${fileChecksum}${EOL}`);

      } else if (!this.#appendChecksum) {

        this.#fileStream.write(`${fileName} ${fileChecksum}${EOL}`);

      }

      if (fileChecksum === this.#checksumData[fileName]) {

        return callback();

      }

    }

    this.#fileStream.write(`${fileName} ${fileChecksum}${EOL}`);

    this.push(chunk, enc);
    callback();

  }

  _flush(callback) {

    endTheWriteChecksumFileStream(this.#fileStream);
    callback();

  }

}
