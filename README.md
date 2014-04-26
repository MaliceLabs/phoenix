**Phoenix** is a rewrite of [Fur Affinity] in [Node.js],
in an attempt to improve security and maintainability. It sports a full
redesign of code, user interface, and database.


## Prerequisites

 - [Node.js]
 - [PostgreSQL]
 - [Redis]
 - [Nginx]
 - [GraphicsMagick]


## Configuration

`config.json` contains the application configuration. It includes:

 - `database`, the PostgreSQL connection string
 - `password`
   - `bcryptRounds`, the base-2 logarithm of the number of rounds of bcrypt
     to be applied to passwords

`sample/` contains sample Nginx configuration. You can get started quickly
with its Makefile:

```shell
$ make -C sample/
⋮
$ sudo make -C sample/ install NGINX_CONF_DIR=/path/to/nginx/conf/
```

Then import your new development CA from `sample/ca.crt`, start Nginx,
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
