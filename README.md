<<<<<<< HEAD
Phoenix-Garuda
=======================

A fork of FurAffinity's Phoenix Project.

Will be updated with fixes, patches and features that will no doubt be required.

Phoenix Project Launched - January 15th, 2014
No code officially written as of 12:49AM March 28, 2014

Status: Unknown
=======
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

`config.json` contains the configuration. It includes:

 - `database`, the PostgreSQL connection string
 - `passwordHash`
   - `rounds`, the number of rounds of PBKDF2 to be applied to passwords
   - `saltLength`, the number of bytes of salt to use in password hashing


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
>>>>>>> upstream/master
