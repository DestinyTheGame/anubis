import { app } from 'electron';

//
// Default configuration for the application window.
//
const defaults = {
  //
  // Window dimensions.
  //
  'width': 800,
  'height': 600,

  //
  // Message format translations.
  //
  'locales': app.getLocale(),

  //
  // Application registration.
  //
  'url': 'https://www.bungie.net/en/Application/Authorize/11069',
  'key': '8b00abdac5844cc2aa0b68b52df4e9fe'
};

//
// Expose our own translations and messages by default.
//
export default defaults;
