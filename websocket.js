
/**
 * Interact with out WebSocket connection to handle communication between server
 * and client.
 *
 * @param {WebSocket} client Incoming WebSocket connection.
 * @private
 */
function incoming(boot) {
  return function connection(client) {
    const destiny = boot.get('destiny');

    console.log('recieved incomming connection');
  }
}

export { incoming };
