import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const srcRoot = __dirname;
export const checksumFilePath = join(srcRoot, '.checksum');
export const srcGlob = join(srcRoot, 'files-to-minify', '**/*.js');
export const destPath = join(srcRoot, 'dist');
