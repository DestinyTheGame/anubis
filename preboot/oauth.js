import { XMLHttpRequest } from 'xmlhttprequest';
import Bungie from 'bungie-auth/electron';
import { gets, set } from '../storage';
import Guardian from 'guardian.gg';
import Destiny from 'destiny-api';

/**
 * Async boot sequence for setting up our authentication with Bungie.net
 *
 * @param {Object} boot Simple boot instance.
 * @param {Function} next Completion callback.
 * @public
 */
export default function preboot(boot, next) {
  gets('key', 'url', 'accessToken', 'refreshToken', (err, config) => {
    if (err) return next(err);

    //
    // Setup our authentication handler for electron with the correct
    // authentication information for our application.
    //
    const bungie = new Bungie({
      refreshToken: config.refreshToken,
      accessToken: config.accessToken,
      key: config.key,
      url: config.url,

      /**
       * Automatically store.
       *
       * @param {Error} err Optional error.
       * @param {Object} payload data received from the server.
       * @private
       */
      fresh: function fresh(err, payload) {
        if (err) return; // @TODO black hole error here. Basically, we're fucked.

        set('refreshToken', payload.refreshToken, function () {
          set('accessToken', payload.accessToken, function () {
            // @TODO do some debug stuff.
          });
        });
      }
    });

    const destiny = new Destiny(bungie, { XHR: XMLHttpRequest });
    const guardian = new Guardian({ XHR: XMLHttpRequest });

    boot.set('guardian', guardian);
    boot.set('destiny', destiny);
    boot.set('bungie', bungie);

    next();
  });
};
