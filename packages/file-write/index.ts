import fs from 'fs';

export function write(path: string, content: string, encoding:BufferEncoding = 'utf-8') {
  fs.writeFileSync(path, content, { encoding });
}
