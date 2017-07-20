/**
 * @description - expose several plugin
 * @author - huang.jian <hjj491229492@hotmail.com>
 */
'use strict';

const CompressionPlugin = require('./src/CompressionPlugin');
const CleanupPlugin = require('./src/CleanupPlugin');

module.exports = {
  CompressionPlugin,
  CleanupPlugin
};