# @ryanburnette/[url-path-to-local-path][1]

Given a requested URL path, return a present and safe local path.

- consistent behavior with `/foo` and `/foo/` etc
- consistent behavior with `/foo` finding `/foo.html` etc
- checks for existence of local file
- able to set a different extension for local file
- able to test for a series of local extensions
- protects from path traversal

## Usage

```js
var UrlPathToLocalPath = require('@ryanburnette/url-path-to-local-path');

var options = {
  context: './content/',
  localExtension: '.ejs'
};

var getLocalPath = UrlPathToLocalPath(options);

// Express middleware example
module.exports = function(req, res, next) {
  getLocalPath(req.path).then(function(localPath) {
    // do your thing
  next();
  })
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
