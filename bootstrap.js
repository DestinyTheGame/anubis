import server from './preboot/server';
import oauth from './preboot/oauth';
import { app } from 'electron';
import anubis from './anubis';
import boot from 'booting';

//
// Prevent the app for randomly closing when all windows are getting closed. In
// the boot sequence it's possible that we create a window for oauth
// authorization and close it afterwards. This does not mean that we want the
// app to just close, as we're waiting for the oauth flow to continue.
//
function keepalive() { }
app.on('window-all-closed', keepalive);

//
// Simple boot sequence to start up all required components to get our
// application working.
//
boot(new Map())
.use(server)
.use(oauth)
.start(anubis);
