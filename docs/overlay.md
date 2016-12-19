# Overlay

When the application starts we automatically start up a web server that runs on
your local host. We use this server for communication within the application but
also host a page that can be used as overlay in streaming software like OBS and
GameCapture HD.

We don't have a button that opens the URL yet, so you'll have to manually
navigate to the page. When you first open the application we start search for
port numbers on your device that are open so we can start our server on it. This
process starts by port `8000` by default. If it's not open it increments the
number by one checks `8001` and so on. So if you are lucky, you only have to
open:

```
http://localhost:8000
```

And it should show up the trials card. If there's already something running you
might need to try `8001`, `8002` etc.
