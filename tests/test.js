import path from 'path';
import UrlPathToLocalPath from '../index.js';

const fixturesDir = path.resolve('tests/fixtures');

describe('UrlPathToLocalPath', () => {
  const resolvePath = UrlPathToLocalPath.create({
    workDir: fixturesDir,
    extension: '.html'
  });

  it('should resolve to /index.html for root path', async () => {
    const localPath = await resolvePath('/');
    expect(localPath).toBe(path.join(fixturesDir, 'index.html'));
  });

  it('should resolve to /foo.html for /foo path', async () => {
    const localPath = await resolvePath('/foo');
    expect(localPath).toBe(path.join(fixturesDir, 'foo.html'));
  });

  it('should resolve to /foo.html for /foo/ path', async () => {
    const localPath = await resolvePath('/foo/');
    expect(localPath).toBe(path.join(fixturesDir, 'foo.html'));
  });

  it('should resolve to /bar/index.html for /bar path', async () => {
    const localPath = await resolvePath('/bar');
    expect(localPath).toBe(path.join(fixturesDir, 'bar', 'index.html'));
  });

  it('should throw PathNotFoundError for invalid path', async () => {
    await expect(resolvePath('/nonexistent')).rejects.toThrow('Local path not found');
  });

  it('should throw PathNotFoundError for path traversal attempt #1', async () => {
    const traversalPath = '/../etc/passwd';
    await expect(resolvePath(traversalPath)).rejects.toThrow('Local path not found');
  });

  it('should throw PathNotFoundError for path traversal attempt #2', async () => {
    const traversalPath = '../test.js';
    await expect(resolvePath(traversalPath)).rejects.toThrow('Local path not found');
  });
});
