# LINS backend

[![Build Status](https://travis-ci.org/motorny/lins-backend.svg?branch=master)](https://travis-ci.org/motorny/lins-backend)

## Downloading a project
Firstly you need to prepare your environment - you need to install Node.js and NPM packet manager.
```
# Grab the project
git clone git@github.com:motorny/lins-backend
cd lins-backend
```

### Instal required packages

```
npm install
```


### Building and running

To create database and tables:

**It will drop existing database and all data!**

```
npm run initDB
```

To fill database, use:
```
npm run seedDB
```

To start server in develop mode with live reloading:
```
npm run start:dev
```

