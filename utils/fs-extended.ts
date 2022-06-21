import fs from 'fs';

export function WriteIfDiff(_path: string, content: string) {
  if (fs.existsSync(_path) && fs.readFileSync(_path, 'utf-8') === content) { return; }
  fs.writeFileSync(_path, content);
}