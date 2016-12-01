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
  'locales': app.getLocale()
};

//
// Expose our own translations and messages by default.
//
export default defaults;
