/**
 * @description - webpack-plugin-strawberry util method unit suits
 * @author - huang.jian <hjj491229492@hotmail.com>
 */
'use strict';

const { validateExcludeRules, matchExcludeRules } = require('../helper/util');

describe('util methods', function () {
  it('should validate exclude options', function () {
    expect(validateExcludeRules({})).toBeFalsy();
    expect(validateExcludeRules([{}])).toBeFalsy();
    expect(validateExcludeRules(['hello.txt', /\.gz$/])).toBeTruthy();
  });

  it('should match pass in rules', function () {
    const rules = ['hello.txt', /\.gz$/];
    const matcher = matchExcludeRules(rules);

    expect(matcher('hello.txt')).toBeTruthy();
    expect(matcher('hello.txt.gz')).toBeTruthy();
    expect(matcher('jest.txt')).toBeFalsy();
  });
});