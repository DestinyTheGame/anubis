import TickTock from 'tick-tock';

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
    const destiny = boot.get('destiny');
    const timers = new TickTock();

    timers.setInterval('advisors', () => {
      destiny.go(() => {
        const active = destiny.characters.active();

        if (active) active.advisors((err, data) => {
          if (err) return client.send(JSON.stringify({
            error: err.message
          }));

          data.type = 'advisors';
          client.send(JSON.stringify(data), (err) => {
            //
            // This flow is completely async, so it could be that by the time we
            // got our data the connection was already closed. Hence this
            // callback.
            //
          });
        });
      });
    }, 10000);

    client.on('close', () => {
      timers.destroy();
    });
  }
}

export { incoming };
