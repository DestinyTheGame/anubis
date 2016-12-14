import server from './preboot/server';
import oauth from './preboot/oauth';
import anubis from './anubis';
import boot from 'booting';

//
// Simple boot sequence to start up all required components to get our
// application working.
//
boot(new Map())
.use(server)
.use(oauth)
.start(anubis);
