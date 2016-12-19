# Authentication

### Bungie.net authentication

When you first start the application you are prompted to login to Bungie.net.
This is because some of the information we need is locked down by Bungie and
requires authentication. The last thing we want to do in this application is
store passwords and authentication information of your account. 

That's why Bungie has created [a new sanctioned authentication method][source]
for us, third-party app developers to use. It gives you, the user a chance to
review the permissions that we request. You can review all `write` operations
that are preformed by our application and disable access to your account if want
to.

We request the following permissions from your account:

- **Read your Destiny vendor and advisor information.** Trials of Osiris is
  threaded as an advisor instead of activity by Bungie so we need access to this
  scope in order to read out your Trials card information.
- **Read your Destiny vault and character inventory.** Used for bot commands like
  `!primary` and `!special`, Check if you have Trials card in your inventory and
  for our upcoming vault management feature.
- **Access items like your notifications, memberships, and recent activity.** We
  need to know your membership in order to request the characters you own.
  Without this knowledge we can't really do anything.

[source]: https://www.bungie.net/en/Help/Article/45481
