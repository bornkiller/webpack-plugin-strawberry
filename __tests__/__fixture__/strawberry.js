/**
 * @description - webpack-plugin-strawberry fixture
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

'use strict';

// External
import isUndefined from 'lodash.isundefined';
import isNull from 'lodash.isnull';

// Internal
const polaris = Math.random();

isUndefined(polaris);
isNull(polaris);

require.ensure(['./wu_kong_0.jpg', './wu_kong_2.jpg'], () => {
  const wu_kong_0 = require('./wu_kong_0.jpg');
  const wu_kong_2 = require('./wu_kong_2.jpg');

  isUndefined(wu_kong_0);
  isUndefined(wu_kong_2);
});
