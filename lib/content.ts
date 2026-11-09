import 'server-only';
import fs from 'node:fs';
import path from 'node:path';

const CONTENT_DIR = path.join(process.cwd(), 'content');

function scan(dir: string, prefix: string[] = []): string[][] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) return scan(path.join(dir, entry.name), [...prefix, entry.name]);
    if (!entry.isFile() || !entry.name.endsWith('.mdx')) return [];
    return [[...prefix, entry.name.slice(0, -4)]];
  });
}

export function getLessonPaths() { return scan(CONTENT_DIR); }

export function getLesson(slug: string[]) {
  // Reject malformed route components; never interpolate arbitrary traversal segments.
  if (!slug.length || slug.some(s => !/^[a-z0-9-]+$/.test(s))) return null;
  const file = path.join(CONTENT_DIR, ...slug) + '.mdx';
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, 'utf8');
}
