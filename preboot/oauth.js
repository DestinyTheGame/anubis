import Bungie from 'bungie-auth/electron';
import { gets, set } from '../storage';

/**
 * Async boot sequence for setting up our authentication with Bungie.net
 *
 * @param {Object} app Simple application instance.
 * @param {Function} next Completion callback.
 * @public
 */
export default function preboot(app, next) {
  gets('key', 'url', 'accessToken', 'refreshToken', (err, config) => {
    if (err) return next(err);

    const bungie = new Bungie(config);

    app.set('bungie', bungie);
    next();
  });
};
