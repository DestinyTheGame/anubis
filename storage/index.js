import storage from 'electron-json-storage';
import EventEmitter from 'eventemitter3';
import reduce from 'async/reduce';
import messages from './messages';
import defaults from './defaults';

//
// These are our application defaults, if nothing can be found in our storage
// API's we will try and pull the information from this instead.
//
const config = Object.assign({}, defaults, messages);
const emitter = new EventEmitter();

/**
 * Fetch an item from our configuration.
 *
 * @param {String} key Name of the configuration item.
 * @param {Function} fn Completion callback.
 * @public
 */
function get(key, fn) {
  storage.get(key, (err, value) => {
    if (err) return fn(err);

    //
    // Handle edge case bug where unknown values are returning an empty object
    // instead.
    //
    if (JSON.stringify(value) === JSON.stringify({})) {
      value = undefined;
    }

    if (typeof value === 'undefined' && key in config) {
      value = config[key];
    }

    fn(undefined, value);
  });
}

/**
 * Get multiple keys from the storage.
 *
 * @param {String} ...keys Multiple keys that need to be fetched.
 * @param {Function} fn Completion callback.
 * @public
 */
function gets(...keys) {
  const fn = keys.pop();

  reduce(keys, Object.create(null), (memo, key, next) => {
    get(key, (err, data) => {
      if (err) return next(err);

      memo[key] = data;
      next(undefined, memo);
    });
  }, fn);
}

/**
 * Get all configuration values.
 *
 * @param {Function} fn Completion callback.
 * @public
 */
function all(fn) {
  storage.getAll(fn);
}

/**
 * Store a new configuration value.
 *
 * @param {String} key Name of the configuration item.
 * @param {Mixed} data Information to store.
 * @param {Function} fn Completion callback.
 * @public
 */
function set(key, data, fn) {
  storage.set(key, data, (err) => {
    if (!err) emitter.emit('config', key, data);
    fn(err, data);
  });
}

//
// Expose the API.
//
export { get, gets, set, all, emitter };
