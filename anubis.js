import electron, { app, BrowserWindow } from 'electron';
import { gets } from './storage';
import path from 'path';
import url from 'url';

let anubis;

/**
 * Create the Application window.
 *
 * @private
 */
function create(boot) {
  gets('width', 'height', (err, config) => {
    if (err) throw err;

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
      search: '?server=ws://localhost:'+ boot.get('port'),
      protocol: 'file:',
      slashes: true
    }));
  });
}

/**
 * Every part of our application is booted and setup. So we can safely
 */
export default function start(err, boot) {
  if (err) throw err; // @TODO display an error page.

  //
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  //
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  });

  //
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  //
  app.on('activate', () => {
    if (anubis === null) create(boot);
  });

  create(boot);
};
