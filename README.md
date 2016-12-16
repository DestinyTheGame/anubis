# Anubis

Anubis is lightweight desktop client that written in Electron. It provides you
with information that might be useful when you are participating in the Trials
of Osiris in Destiny the Game.

All the parts that make this application tick are Open Sourced:

- [destiny-api](https://github.com/DestinyTheGame/destiny-api) A JavaScript
  based API client that interacts with Bungie.net's API.
- [bungie-auth](https://github.com/DestinyTheGame/bungie-auth) A JavaScript
  based oauth sign-in flow for Bungie's weird Oauth 2 implementation.

## Installation

For development purposes we assume that you have the following tools installed
locally:

- [nodejs](https://nodejs.org/en/) Our JavaScript environment
- [git](https://git-scm.com/) So you can download the source from GitHub

And `npm`, but that is bundled with Node.js. Once you have all dependencies
installed you can clone this project to your local disk. In your terminal enter:

```
git clone git@github.com:DestinyTheGame/anubis.git
```

Go to the directory and install all the dependencies using:

```
npm install .
```

Now that you have the source code and all the dependencies you can run the
application in development mode by running the following command in your cli:

```
npm run dev
```

This will start the Electron Render Application, Node.js server for data access
and various of development scripts to allow hot-reloading of the application
during development.

## Contributing

Thoughts, ideas, fixes, brain farts and pull requests are encouraged in this
project. 

## License

The source code is released as MIT, Bungie, Destiny The Game are trademarks
owned by Bungie. Don't sue me.
