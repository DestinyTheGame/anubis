import bots from './bots';
import storage from '../storage';
import { client as TMI } from 'tmi.js';
import EventEmitter from 'eventemitter3';
import IntlMessageFormat from 'intl-messageformat';

/**
 * A minimal wrapper around the TMI interface so we can write a bit more sane
 * code for all the chat logic.
 *
 * @constructor
 * @param {String} username The key of the `storage` that contains the username.
 * @public
 */
export default class Twitch extends EventEmitter {
  constructor(username) {
    super();

    this.username = username;         // Username / Channel.
    this.bots = {};                   // Plugin handling.
    this.queue = [];                  // Callback queue till we have an API.
    this.api = null;                  // The actual API.

    this.create();
  }

  /**
   * Create a new connection to the twitch server.
   *
   * @param {String} username Name of the username we're trying to connect to.
   * @private
   */
  create() {
    storage.gets(this.username, 'clientId', 'bots', (err, data) {
      if (err) return this.emit('error', err);

      this.api = new TMI({
        channels: [ this.username ],
        identity: {
          username: this.username,
          password: data[this.username]
        },
        options: {
          clientId: data.clientId
        }
      });

      //
      // Actually start the connection to the WebSocket server. If things start
      // failing we probably want to clear our callback queue and notify them of
      // the mistakes.
      //
      this.lies(this.api.connect(), (err, data) => {
        const queue = this.queue.slice(0);
        this.queue.length = 0;

        this.queue.forEach((fn) => { fn(err, data) });
      });

      //
      // Integrate the various of automatic bot commands.
      //
      if (data.bots && data.bots.length) {
        data.bots.forEach((name) => {
          const bot = bots[name];

          //
          // Prevent duplicates and unknown bots from crashing the chat.
          //
          if (!bot || name in this.bots) return;
          this.bots[name] = bot.call(this, this);
        });
      }
    });
  }

  /**
   * Say a message in the chat room.
   *
   * @param {String} message The message to send.
   * @param {Function} fn Completion callback.
   * @public
   */
  say(message, fn) {
    this.go((err) => {
      this.lies(this.api.say(this.username, message), fn);
    });
  }

  /**
   * Write a formatted message to chat.
   *
   * @param {String} icu ICU formatted message.
   * @param {String} locales Language string for the ICU.
   * @param {Object} data Template data for message replacement.
   * @param {Function} fn Completion callback.
   * @public
   */
  format(icu, locales, data, fn) {
    const message = new IntlMessageFormat(icu, locales)
    this.say(message.format(data), fn);
  }

  /**
   * Unwrap promises in to a proper error first callback pattern.
   *
   * @param {Promise} promise The promise we need to wrap.
   * @param {Function} fn Completion callback.
   * @returns {Promise} The things you gave me.
   */
  lies(promise, fn = () => {}) {
    return promise.then((data) => {
      fn(undefined, data);
    }).catch((err) => {
      fn(err);
    });
  }

  /**
   * Queue until we have an API instance ready.
   *
   * @param {Function} fn Completion callback
   * @private
   */
  go(fn) {
    if (!this.api) {
      return this.queue.push(fn);
    }

    fn();
  }
}
