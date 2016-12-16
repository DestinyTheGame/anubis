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
        destiny.characters[0].advisors((err, data) => {
          if (err) return client.send(JSON.stringify({
            error: err.message
          }));

          data.type = 'advisors';
          client.send(JSON.stringify(data));
        });
      });
    }, 10000);

    client.on('close', () => {
      timers.destroy();
    });
  }
}

export { incoming };
