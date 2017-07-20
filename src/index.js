/**
 * @description - node-lib-starter
 * @author - bornkiller <hjj491229492@hotmail.com>
 */

'use strict';

const _ = require('lodash');
const zlib = require('zlib');
const RawSource = require('webpack-sources/lib/RawSource');

const PresetAlgorithm = ['gzip', 'deflate'];
const defaultOptions = {
  exclude: /\.gz$/,
  threshold: 512,
  algorithm: 'gzip',
  compressOptions: {
    level: 7
  }
};
const noop = () => {};

class StrawberryPlugin {
  constructor(options) {
    this.options = _.assign({}, _.omit(defaultOptions, 'compressOptions'), _.omit(options, 'compressOptions'));
    this.compressOptions = _.assign({}, _.pick(defaultOptions, 'compressOptions'), _.pick(options, 'compressOptions'));
    this.algorithm = PresetAlgorithm.includes(this.options.algorithm) ?
      Reflect.get(zlib, `${this.options.algorithm}Sync`) :
      Reflect.get(zlib, 'gzipSync');
  }

  apply(compiler) {
    compiler.plugin('compilation', (compilation) => {
      // Just boilerplate code
      compilation.plugin('module-asset', (module, file) => {
        noop(file);
      });
    });

    compiler.plugin('emit', (compilation, callback) => {
      const assets = compilation.assets;
      const fileNameList = Reflect.ownKeys(assets).filter((filename) => !this.options.exclude.test(filename));
      const lastIndex = fileNameList.length - 1;

      fileNameList.forEach((filename, index) => {
        let file = Reflect.get(assets, filename);
        let content = file.source();

        if (!Buffer.isBuffer(content)) {
          content = Buffer.from(content, 'utf-8');
        }

        // Skip small file
        if (content.byteLength > this.options.threshold) {
          let gzipFilename = `${filename}.gz`;
          let optimizeContent = this.algorithm(content, this.compressOptions);

          Reflect.set(assets, gzipFilename, new RawSource(optimizeContent));
        }

        index === lastIndex && callback();
      });
    });

    compiler.plugin('done', () => {
      // eslint-disable-next-line no-console
      console.log('webpack-plugin-strawberry done');
    });
  }
}

module.exports = StrawberryPlugin;