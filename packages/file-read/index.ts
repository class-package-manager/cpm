import fs from 'fs';

export function read(path: string, encoding: BufferEncoding = 'utf-8') {
  return fs.readFileSync(path, { encoding });
}
