import { getPort as find } from 'portfinder';
import { Server as HTTP } from 'http';
import connection from '../websocket';
import connected from 'connected';
import { Server } from 'ws';

/**
 * Async boot sequence for setting up a random WebSocket server.
 *
 * @param {Object} app Simple application instance.
 * @param {Function} next Completion callback.
 * @public
 */
export default function preboot(app, next) {
  find(function searching(err, port) {
    if (err) return next(err);

    const server = new HTTP((req, res) => {
      res.end('Internal Anubis API server');
    });

    const websocket = new Server({ server });
    websocket.on('connection', connection);

    app.set('websocket', websocket);
    app.set('server', server);
    app.set('port', port);

    connected(server, port, next);
  });
};
