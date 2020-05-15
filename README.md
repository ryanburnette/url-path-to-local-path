# [url-path-to-local-path](https://github.com/ryanburnette/url-path-to-local-path)

[![repo](https://img.shields.io/badge/repository-Github-black.svg?style=flat-square)](https://github.com/ryanburnette/url-path-to-local-path)
[![npm](https://img.shields.io/badge/package-NPM-green.svg?style=flat-square)](https://www.npmjs.com/package/@ryanburnette/url-path-to-local-path)

Safely convert `req.path` into a local path.

## Goals

- Consistent behavior with `/foo` and `/foo/`
- Consistent behavior with `/foo` finding `/foo.html`
- Check for existence of the file
- Set a different extension for local file, req.path might be `index.html` while
  local file is `index.md`
- Option to test for a series of local extensions `['.md', '.html']`
- Protect from path traversal

## Usage

```js
var UrlPathToLocalPath = require('@ryanburnette/url-path-to-local-path');

var getLocalPath = UrlPathToLocalPath({
  context: './content/', // where is the content?
  localExtension: '.ejs' // or use localExtensions with an Array to try multiple extensions
});

// Express middleware example
module.exports = function (req, res, next) {
  getLocalPath(req.path)
    .then(function (localPath) {
      return fs.promises.readFile(localPath, 'utf8');
    })
    .then(function (html) {
      res.send(html);
    })
    // throws an error if no local path found, we'll catch that
    .catch(function (error) {
      next();
    });
};
```

## Options

- `context` Working directory for content.
- `localExtension` If the local files have a different extension such as `.md`
  or `.ejs`
- `localExtensions` Use this with an array if multiple extensions should be
  tested
