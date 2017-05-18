'use strict';

const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const assert = require('yeoman-generator').assert;

// Files that are expected to exist in certain conditions.
const FILES = {

  common: [
    'scripts/banner.ejs',
    'scripts/modules.rollup.config.js',
    'scripts/test.rollup.config.js',
    'scripts/umd.rollup.config.js',
    'scripts/version.js',
    'src/plugin.js',
    'test/index.html',
    'test/karma.conf.js',
    'test/plugin.test.js',
    '.babelrc',
    '.editorconfig',
    '.gitignore',
    '.npmignore',
    'jsdoc.json',
    'CHANGELOG.md',
    'CONTRIBUTING.md',
    'index.html',
    'package.json',
    'README.md'
  ],

  oss: [
    '.travis.yml',
    'LICENSE'
  ],

  docs: [
    'jsdoc.json'
  ],

  sass: [
    'src/plugin.scss'
  ]
};

const GENERATOR_PATH = path.join(__dirname, '../generators/app');

/**
 * Gets a joined array of filenames from the FILES object.
 *
 * @param    {...string}
 *           Keys from FILES
 *
 * @return   {Array}
 *           An array of filenames.
 */
const fileList = () =>
  _.union.apply(_, _.toArray(arguments).map(str => FILES[str]));

/**
 * Set up options to always skip installation.
 *
 * @param  {...Object}
 *         Same as Object.assign.
 *
 * @return {Object}
 *         A final, merged object.
 */
const options = function() {
  return _.assign.apply(_, [{skipInstall: true}].concat(_.toArray(arguments)));
};

/**
 * Function to call when `before` setup is complete.
 *
 * This function expects to be bound to a RunContext: `onEnd.bind(this)`;
 *
 * @param {Object} context
 *        A test context - `this` in a Mocha hook.
 * @param {Function} [done]
 *        A callback to call when finished.
 */
const onEnd = (context, done) => {

  // There are cases where a package.json will not be created.
  try {
    context.pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  } catch (x) {
    context.pkg = null;
  }

  if (typeof done === 'function') {
    done();
  }
};

/**
 * Assert that all keys listed in an array match non-empty strings in an object.
 *
 * @param  {Object} obj
 *         An object to test.
 *
 * @param  {Array}  checks
 *         An array of keys to verify as non-empty strings.
 */
const allAreNonEmpty = function(obj, checks) {
  checks.forEach(key => {
    const s = obj[key];

    assert.ok(
      typeof s === 'string' && (/\S/).test(s),
      `"${key}" was a non-empty string`
    );
  });
};

module.exports = {
  GENERATOR_PATH,
  fileList,
  options,
  onEnd,
  allAreNonEmpty
};
