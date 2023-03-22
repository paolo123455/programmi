/* eslint-disable import/no-extraneous-dependencies */
const test = require('tapava');

const filter = require('./index');

test('filter()', t => [
  t.deepEqual(
    filter(new Set([1, 2, 3, 4, 5]), (num => num < 3)),
    new Set([1, 2])
  )
]);
