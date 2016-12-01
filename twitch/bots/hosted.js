import storage from '../../storage';

/**
 * Pay respect to the user who just hosted your channel.
 *
 * @param {Twitch} twich API reference
 * @public
 */
export default function bot(twitch) {
  twitch.api.on('hosted', function hosted(channel, username, viewers) {
    storage.gets('twitch.hosted', 'locales', function get(err, message) {
      if (err) return;

      twitch.format(data['twitch.hosted'], data.language, {
        channel: channel,
        username: username,
        viewers: viewers
      });
    });
  });
}
