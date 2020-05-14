# @ryanburnette/[url-path-to-local-path][1]

[![repo](https://img.shields.io/badge/repository-Github-black.svg?style=flat-square)](https://github.com/ryanburnette/url-path-to-local-path)
[![npm](https://img.shields.io/badge/package-NPM-green.svg?style=flat-square)](https://www.npmjs.com/package/@ryanburnette/url-path-to-local-path)

Given a requested URL path, return a present and safe local path.

- consistent behavior with `/foo` and `/foo/` etc
- consistent behavior with `/foo` finding `/foo.html` etc
- checks for existence of local file
- able to set a different extension for local file
- able to test for a series of local extensions
- protects from path traversal
- there should only be one match, the universe might break if there is more than
  one correct answer

## Usage

```js
var getLocalPath = require('@ryanburnette/url-path-to-local-path')({
  context: './content/',
  localExtension: '.ejs' // or use localExtensions with an Array to try multiple
});

// Express middleware example
module.exports = function (req, res, next) {
  getLocalPath(req.path).then(function (localPath) {
    if (localPath) {
      // do your thing
      return;
    }
    next();
  });
};
```

## Options

### Context

Set `options.context` working directory for content.

### Local Extension

Set `options.localExtension` if the local files have a different extension such
as `.ejs`.

### Local Extensions

Set `options.localExtensions` to an array if multiple extensions should be
tested. The first match wins.

```javascript
options.localExtensions = ['.html', '.ejs'];
```

[1]: https://github.com/ryanburnette/url-path-to-local-path
