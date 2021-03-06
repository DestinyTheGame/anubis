import { emitter, all, set } from './storage';
import diagnostics from 'diagnostics';
import Report from './report';

//
// Setup a debug instance.
//
const debug = diagnostics('anubis:websocket');

/**
 * Interact with out WebSocket connection to handle communication between server
 * and client.
 *
 * @param {WebSocket} client Incoming WebSocket connection.
 * @private
 */
function incoming(boot) {
  /**
   * Handle incoming connections.
   *
   * @param {WebSocket} client Incoming WebSocket connection.
   * @private
   */
  return function connection(client) {
    const report = new Report(boot);
    const destiny = boot.get('destiny');

    /**
     * Process updates for the config.
     *
     * @param {String} key name of the config value that changed
     * @param {Mixed} value New value
     * @private
     */
    function update(key, value) {
      const payload = {};
      payload[key] = value;

      client.send(JSON.stringify({ type: 'config', payload: payload }), () => {
        //
        // Catch potential errors.
        //
      });
    }

    emitter.on('config', update);
    all(function allstorage(err, data) {
      client.send(JSON.stringify({ type: 'config', payload: data }), () => {
        //
        // Catch potential errors.
        //
      });
    });

    //
    // All our supported RPC endpoints.
    //
    const endpoints = {
      'config.set': function configchange(data, next) {
        set(data.key, data.value, next);
      },

      'destiny.active.advisors': function advisors(data, next) {
        destiny.go(function go() {
          const active = destiny.characters.active();

          if (active) active.advisors(function advisors(err, data) {
            if (err) return next(err);

            //console.log(JSON.stringify(data.activities.trials, null, 2));

            data.type = 'advisors';
            next(undefined, data);
          });
        });
      },

      'destiny.trials.report': function search(username, next) {
        report.lookup(username, (failed) => {
          next(failed);
        });
      }
    };

    report.on('fireteam', () => {
      client.send(JSON.stringify({
        type: 'report',
        fireteam: report.fireteam
      }));
    });

    report.on('loadout', () => {
      client.send(JSON.stringify({
        type: 'report',
        loadout: report.loadout
      }));
    });

    report.on('error', (err) => {
      client.send(JSON.stringify({
        type: 'report',
        err: err
      }));
    });

    //
    // Handle incoming RPC messages from the client.
    //
    client.on('message', function incoming(message) {
      let data;

      try { data = JSON.parse(message); }
      catch (e) { return debug('failed to parse message', e); }

      if (data.type === 'rpc') {
        if (data.endpoint in endpoints) {
          return endpoints[data.endpoint](data.data, (...args) => {
            client.send(JSON.stringify({ type: 'rpc', id: data.id, args: args }), () => {
              //
              // This flow is completely async, so it could be that by the time we
              // got our data the connection was already closed. Hence this
              // callback.
              //
            });
          });
        }

        debug('unknown rpc(%s) endpoint, for id %s', data.endpoint, data.id);
      }
    });

    client.on('close', function () {
      emitter.off('config', update);
      report.destroy();
    });
  }
}

export { incoming };
