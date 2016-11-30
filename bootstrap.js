import electron, { BrowserWindow } from 'electron';
import config from './anubis';
import path from 'path';
import url from 'url';

const app = electron.app;
let anubis;

console.log(electron);

/**
 * Conditionally create a new Application window.
 */
function activate() {
  if (anubis) return;

  anubis = new BrowserWindow({ width: config.width, height: config.height });
  anubis.on('closed', () => {
    anubis = null;
  });

  //
  // Allow introspection of the application when running in DEV mode.
  //
  if (process.env.NODE_ENV === 'development') {
    anubis.webContents.openDevTools();
  }

  //
  // Load the actual application.
  //
  anubis.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
}

//
// OSX is being an odd ball here, it doesn't shutdown the app when you close
// windows only when you explicitly close (CMD + Q) the application.
//
if (process.platform !== 'darwin') {
  app.on('window-all-closed', app.quit);
}

app.on('activate', activate);
app.on('ready', activate);
