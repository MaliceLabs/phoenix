[![Build status][Travis badge]][Build status]

**Phoenix** is a rewrite of [Fur Affinity] in [Node.js],
in an attempt to improve security and maintainability. It sports a full
redesign of code, user interface, and database.


## Prerequisites

 - [Node.js]
 - [PostgreSQL]
 - [Redis]
 - [Nginx]
 - [GraphicsMagick]
 - [GnuTLS]


## Configuration

To get started, create `config.json` from `config.sample.json`.
Phoenix will read its configuration from here.

`sample/` contains sample Nginx configuration. You can get started quickly
with its Makefile:

```shell
$ make -C sample/
⋮
$ sudo make -C sample/ install NGINX_CONF_DIR=/path/to/nginx/conf/
```

Then import your new development CA from `sample/ca.crt`, start Nginx,
add an `/etc/hosts` (or equivalent) entry for `::1 local.furaffinity.net`,
and visit <https://local.furaffinity.net/>!


## Running the server

1. Run `npm install` to install package dependencies from npm
2. Migrate the database with `node models/migrate`
3. Run the development server with `node develop`

  [Fur Affinity]: https://www.furaffinity.net/
  [Node.js]: http://nodejs.org/
  [PostgreSQL]: http://www.postgresql.org/
  [Redis]: http://redis.io/
  [Nginx]: http://nginx.org/
  [GraphicsMagick]: http://www.graphicsmagick.org/
  [GnuTLS]: http://www.gnutls.org/

  [Build status]: https://travis-ci.org/FurAffinity/phoenix
  [Travis badge]: https://api.travis-ci.org/FurAffinity/phoenix.svg?branch=master
