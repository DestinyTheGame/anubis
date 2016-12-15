import { getPort as find } from 'portfinder';
import { incoming } from '../websocket';
import { Server as HTTP } from 'http';
import connected from 'connected';
import { Server } from 'ws';

/**
 * Async boot sequence for setting up a random WebSocket server.
 *
 * @param {Object} boot Simple boot instance.
 * @param {Function} next Completion callback.
 * @public
 */
export default function preboot(boot, next) {
  find(function searching(err, port) {
    if (err) return next(err);

    const server = new HTTP((req, res) => {
      res.end('Internal Anubis API server');
    });

    const websocket = new Server({ server });
    websocket.on('connection', incoming(boot));

    boot.set('websocket', websocket);
    boot.set('server', server);
    boot.set('port', port);

    connected(server, port, next);
  });
};
