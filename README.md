# Anubis

Anubis is a lightweight desktop application that is written in
[Electron][electron]. It's goal is to provide you with information and stats
that might be useful when you are participating in the Trials of Osiris.

This repository holds the code for the application it self. We did write some
additional projects to make this application tick. These projects are also Open
Sourced under the `destinythegame` project:

- [destiny-api][destiny-api] A JavaScript based API client that interacts with Bungie.net's API.
- [bungie-auth][bungie-auth] A JavaScript based oauth sign-in flow for Bungie's weird Oauth 2 implementation.

If you are interested in the development of the app, want to receive updates on
the progress or just want to chat with the fine folks that make it app, [join our
Discord server!][discord]

## Table of Contents

- [Installation](#installation)
- [Development](#development)
- [Releasing](#releasing)
- [Contributing](#contributing)
- [License](#license)

## Installation

First of all, thanks for taking the effort to try the application. Any feedback
good or bad is much appreciated. To install the application you need to download
the correct build for Operating System. We currently support

- Mac OS
- Windows (32 and 64 bit)

The applications are uploaded to our [releases] page at:

https://github.com/DestinyTheGame/anubis/releases

Each version has a *downloads* section where you can select and download the
application that matches your system. If you want to run the application on a
different Operating System/platform you might need to build the app your self or
run it in development mode. See [development](#development) for more
information.

Please note that we do not have auto updating setup yet, so you need to
*manually* check if new builds are available by looking at our
[releases][releases] page.

If you have issues installing the application either create an issue in our
issue tracker or [join us on discord][discord].

## Development

The application it self is build upon the [Electron][electron] which allows us
to build cross platform applications using JavaScript, HTML and CSS. Electron
uses Node.js and Chromium to build the application. So for development purposes
we assume that you have the following development tools installed locally:

- [nodejs][nodejs] Our JavaScript environment
- [git][git] So you can download the source from GitHub

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
application in development mode by running the following command in your CLI:

```
npm run dev
```

This will start the Electron Render Application, Node.js server for data access
and various of development scripts to allow hot-reloading of the application
during development.

## Releasing

Until the project has matured to a 1.0 release assume that every release
contains breaking changes. We iterate at a rapid phase in order to release the
features we want. During the development of these features it could be that we
need to re-write some of our internals that break backwards compatibility.

Once we've reached our 1.0.0 status the version numbers will follow semver 2.0
strictly. Meaning that the first number in the version indicates a Major
release which are usually containing breaking changes. The second digit
indicates a minor version which is used to indicate the release of new features
and functionality. The last version number indicates the patch release. This is
bumped for your everyday fixes.

Our current release platforms are:

- Windows
- Mac OSX

This is the following flow to create a new release:

1. Make sure you have the latest code base
2. Remove your `node_modules` folder from the directory
3. Run `npm install` to get the latest dependencies.
4. Test run the application using `npm run dev`
5. If basic quality assurance has been done a release can be made
6. Bump the version number `package.json` and `git tag <version>`.
7. Push version number & tag to Github.

To generate builds for the platforms run:

```
npm run release
```

This creates a `builds` folder where it will place the various of builds. We use
[electron-packager][packager] to generate the releases. Once the builds are
created double check if they are working as intended by opening the application.

Once the builds are completed you can edit the created tag on our [releases]
page on GitHub. Upload the build, and write release notes so people know what
was fixed or introduced. And announce the new release in our [discord][discord]
release channel.

## Contributing

Thoughts, ideas, fixes, brain farts and pull requests are encouraged in this
project. Please create a GitHub account and create issues in our issue tracker:

- https://github.com/DestinyTheGame/anubis/issues/new

Hang out in our [discord] channel to discuss features, bugs or help.

## License

The source code is released as MIT, Bungie, Destiny The Game are trademarks
owned by Bungie. Don't sue me.

[discord]: https://discord.gg/kXn2NmQ
[electron]: http://electron.atom.io/
[nodejs]: http://electron.atom.io/
[git]: http://electron.atom.io/
[destiny-api]: https://github.com/DestinyTheGame/destiny-api
[bungie-auth]: https://github.com/DestinyTheGame/bungie-auth
[releases]: https://github.com/DestinyTheGame/anubis/releases
[packager]: https://github.com/electron-userland/electron-packager
