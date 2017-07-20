/**
 * @description - helper methods
 * @author - bornkiller <hjj491229492@hotmail.com>
 */
'use strict';

const _ = require('lodash');

/**
 * @description - validate CleanupPlugin exclude options
 *
 * @param rules
 *
 * @return {boolean}
 */
const validateExcludeRules = (rules) => {
  return _.isArray(rules) && rules.every((rule) => _.isString(rule) || _.isRegExp(rule));
};

/**
 * @description - operate CleanupPlugin exclude options
 *
 * @param {Array.<string|RegExp>} rules
 */
const matchExcludeRules = (rules) => (filename) => {
  return rules.some((rule) => _.isString(rule) ? rule === filename : rule.test(filename));
};

module.exports = {
  validateExcludeRules,
  matchExcludeRules
};