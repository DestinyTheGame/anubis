//
// These are the default messages that we use in our application. They are
// parsed and formatted using the ICU message format.
//
const messages = {
  //
  // Bots: hosted
  //
  'twitch.hosted': `Thanks @{channel} for the hosting me{viewers, plural,
      =0 {}
      one { for 1 viewer}
      other { for {viewers} viewers}
  }! I hope you had a great stream.`
};

//
// Expose our own translations and messages by default.
//
export default messages;
