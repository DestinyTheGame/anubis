import electron, { app, BrowserWindow, shell } from 'electron';
import { gets, remove } from './storage';
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

    //
    // General redirect handler.
    //
    const handleRedirect = (e, href) => {
      const parsed = url.parse(href);
      e.preventDefault();

      if ('file:' !== parsed.protocol) {
        return shell.openExternal(href);
      }

      //
      // Platform edge case:
      //
      // On windows the pathname that is supplied is prefixed with the name of
      // the hard drive so instead of an URL file:///logout you got
      // file://C:/logout so the pathname ends up as /C:/logout
      //
      const pathname = parsed.pathname.split('/').pop();

      //
      // Special case for logout, we really want to just kill the app after
      // nuking all logout information.
      //
      if ('logout' === pathname) {
        remove('accessToken', 'refreshToken', (err) => {
          app.quit();
        });
      }
    };

    anubis.webContents.on('will-navigate', handleRedirect);
    anubis.webContents.on('new-window', handleRedirect);
    anubis.maximize();
  });
}

/**
 * Every part of our application is booted and setup. So we can safely.
 *
 * @param {Error} err Optional error.
 * @param {Map} boot boot object.
 * @private.
 */
export default function start(err, boot) {
  if (err) throw err; // @TODO display an error page.

  //
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  //
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
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
