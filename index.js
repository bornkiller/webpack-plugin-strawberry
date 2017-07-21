/**
 * @description - expose several plugin
 * @author - huang.jian <hjj491229492@hotmail.com>
 */
'use strict';

const CompressionPlugin = require('./lib/CompressionPlugin');
const CleanupPlugin = require('./lib/CleanupPlugin');

module.exports = {
  CompressionPlugin,
  CleanupPlugin
};