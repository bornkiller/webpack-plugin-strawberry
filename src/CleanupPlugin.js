/**
 * @description - cleanup files not emitted by webpack
 * @author - bornkiller <hjj491229492@hotmail.com>
 */
'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const recursiveReadDir = require('fs-readdir-recursive');
const { validateExcludeRules, matchExcludeRules } = require('./util');

const defaultCleanupOptions = {
  quite: false,
  exclude: []
};

class CleanupPlugin {
  constructor(options) {
    this.options = _.assign({}, defaultCleanupOptions, options);
    this.rules = this.options.exclude;

    const status = validateExcludeRules(this.rules);

    if (!status) {
      throw new Error('CleanupPlugin exclude array must consist of string or RegExp');
    }

    this.exclusion = matchExcludeRules(this.rules);
  }

  apply(compiler) {
    compiler.plugin('after-emit', (compilation, callback) => {
      const assets = Reflect.ownKeys(compilation.assets);
      const files = recursiveReadDir(compiler.options.output.path);
      const extraneous = files.filter((filename) => !assets.includes(filename)).filter((filename) => !this.exclusion(filename));
      const lastIndex = extraneous.length - 1;

      if (!extraneous.length) return callback();

      extraneous.forEach((filename, index) => {
        fs.unlinkSync(path.resolve(compiler.options.output.path, filename));

        if (!this.options.quite) {
          // eslint-disable-next-line no-console
          console.log(`${filename} already deleted`);
        }

        if (index === lastIndex) {
          callback();
        }
      });
    });
  }
}

module.exports = CleanupPlugin;