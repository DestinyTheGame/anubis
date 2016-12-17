import { getPort as find } from 'portfinder';
import { incoming } from '../websocket';
import { Server as HTTP } from 'http';
import connected from 'connected';
import express from 'express';
import { Server } from 'ws';
import path from 'path';

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

    const app = express();
    const server = new HTTP(app);
    const websocket = new Server({ server });

    app
    .use('/dist', express.static(path.join(__dirname, '..', 'dist')))
    .use(function req(req, res) {
      res.setHeader('Content-Type', 'text/html');
      res.sendFile(path.join(__dirname, '..', 'index.html'));
    });

    //
    // Handling the incoming connections.
    //
    websocket.on('connection', incoming(boot));

    boot.set('websocket', websocket);
    boot.set('express', express);
    boot.set('server', server);
    boot.set('port', port);

    connected(server, port, next);
  });
};
