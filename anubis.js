import electron, { app, BrowserWindow } from 'electron';
import { gets } from './storage';
import path from 'path';
import url from 'url';

/**
 * Every part of our application is booted and setup. So we can safely
 */
export default function start(err, boot) {
  if (err) throw err; // @TODO display an error page.

  let anubis;
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
      search: '?port='+ boot.port,
      protocol: 'file:',
      slashes: true
    }));
  });
};