'use strict';

import fs from 'fs/promises';
import path from 'path';
import url from 'url';

/**
 * UrlPathToLocalPath module.
 * @namespace UrlPathToLocalPath
 */
const UrlPathToLocalPath = {};

/**
 * Creates a function to resolve URL paths to local file paths.
 * @param {Object} opts - Options object.
 * @param {string} opts.directory - The working directory where files are located.
 * @param {string} opts.extension - The file extension to use (e.g., ".html").
 * @param {boolean} [opts.ignoreDotfiles=true] - Whether to ignore dotfiles.
 * @returns {Function} A function that takes a URL path and resolves it to a local file path.
 * @throws {Error} If `opts.directory` or `opts.extension` are not provided.
 * @throws {PathNotFoundError} If no valid local path is found for the given URL path.
 */
UrlPathToLocalPath.create = function (opts = {}) {
  if (!opts.directory) throw new Error('opts.directory is required');
  if (!opts.extension) throw new Error('opts.extension is required');

  const directory = path.resolve(opts.directory);
  const extension = opts.extension;
  const ignoreDotfiles = opts.ignoreDotfiles !== false;

  return async function resolveUrlPathToLocalPath(urlPath) {
    urlPath = normalizeUrlPath(urlPath, extension);

    const possiblePaths = [
      path.resolve(directory, ...urlPath.split('/')),
      path.resolve(directory, ...urlPath.split('/')) + extension,
      path.resolve(directory, ...urlPath.split('/').filter(Boolean), `index${extension}`)
    ];

    for (const resolvedPath of possiblePaths) {
      if (resolvedPath.startsWith(directory)) {
        try {
          const stats = await fs.stat(resolvedPath);
          if (
            stats.isFile() &&
            resolvedPath.endsWith(extension) &&
            (!ignoreDotfiles || !path.basename(resolvedPath).startsWith('.'))
          ) {
            return resolvedPath;
          }
        } catch (err) {
          // Continue to the next possible path
        }
      }
    }

    throw new PathNotFoundError(`Local path not found for URL: ${urlPath}`);
  };
};

/**
 * Normalizes a URL path by removing queries, ensuring extensions, and handling slashes.
 * @param {string} urlPath - The URL path to normalize.
 * @param {string} extension - The file extension to ensure (e.g., ".html").
 * @returns {string} The normalized URL path.
 */
function normalizeUrlPath(urlPath, extension) {
  urlPath = removeQuery(urlPath);

  if (urlPath === '/') {
    return `index${extension}`;
  }

  if (urlPath.endsWith('/')) {
    return removeTrailingSlash(urlPath).concat(extension);
  }

  return urlPath;
}

/**
 * Removes query and hash from a URL.
 * @param {string} theUrl - The URL to process.
 * @returns {string} The URL without query or hash.
 */
function removeQuery(theUrl) {
  const obj = url.parse(theUrl);
  obj.search = obj.query = '';
  return url.format(obj);
}

/**
 * Removes trailing slashes from a string.
 * @param {string} str - The string to process.
 * @returns {string} The string without trailing slashes.
 */
function removeTrailingSlash(str) {
  return str.replace(/[/]+$/, '');
}

/**
 * Error class for path not found errors.
 */
class PathNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PathNotFoundError';
    this.code = 'ENOENT';
  }
}

export default UrlPathToLocalPath;
