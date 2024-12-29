# url-path-to-local-path

Safely convert `req.path` into a local file path.

## Features

- Consistent handling of `/foo` and `/foo/`
- Resolves `/foo` to `/foo.html` or `/foo/index.html`
- Checks if the resolved file exists
- Supports custom file extensions (e.g., `.html`)
- Protects against path traversal

## Installation

```bash
npm install @ryanburnette/url-path-to-local-path
```

## Usage

```javascript
import UrlPathToLocalPath from '@ryanburnette/url-path-to-local-path';
import fs from 'fs/promises';

const resolvePath = UrlPathToLocalPath.create({
  workDir: './content',
  extension: '.html'
});

// Example: Resolving a path and reading the file
const localPath = await resolvePath('/foo');
const content = await fs.readFile(localPath, 'utf8');
```

## API

### \`UrlPathToLocalPath.create(options)\`

- \`workDir\` (required): The directory to resolve paths within.
- \`extension\` (required): The file extension to resolve, e.g., \`.html\`.

## Example with Express

```javascript
import UrlPathToLocalPath from '@ryanburnette/url-path-to-local-path';
import fs from 'fs/promises';

const resolvePath = UrlPathToLocalPath.create({
  workDir: './content',
  extension: '.html'
});

export default async function (req, res, next) {
  try {
    const localPath = await resolvePath(req.path);
    const content = await fs.readFile(localPath, 'utf8');
    res.send(content);
  } catch (err) {
    next();
  }
}
```
