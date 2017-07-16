/**
 * @description - node-lib-starter
 * @author - bornkiller <hjj491229492@hotmail.com>
 */

'use strict';

const _ = require('lodash');

const defaultOptions = {
  name: 'manifest.json'
};

class StrawberryPlugin {
  constructor(options) {
    this.options = _.merge({}, defaultOptions, options);
  }

  apply(compiler) {
    compiler.plugin('done', () => {
      // console.log('webpack-plugin-strawberry done');
    });
  }
}

module.exports = StrawberryPlugin;