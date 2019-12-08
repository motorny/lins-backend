This quick tutorial will help you setup database connection in Lins-project

## Preparation step

A. Setting up packages:

```sh
npm install
```

Then all needed packages will be installed (at least i hope that there are ALL).

B. Check configuration

1) Goto: src/database/config.js and check that block:
```sh
development: {
    storage: process.env.DEV_DATABASE_URL,
    dialect: 'sqlite',
  },
```
NOTE: This is mandatory for SQLite connection, we need exactly "storage" here, not URL.

2) Then create (or edit existing) file ".env" in root directory of lins-backend, you need to make it somewhat like that:

```sh
DATABASE_URL=
DEV_DATABASE_URL=C:\\Some_place\\Subfolder\\subsubfolder\\LINS\\<name_of_database>.sqlite
```

It it better that this database is not existing right now.

3) Ensure that directories are present:

```sh
root
--src
----common
----database
------config
------migrations
------models
----resources
```
If migrations are gone - create that folder.

4) Goto file ".sequelizerc" in main root of lins-backend and ensure that it contains:

```sh
const path = require('path')

module.exports = {
  config: path.resolve('./src/database/config', 'config.js'),
  'models-path': path.resolve('./src/database/models'),
  'seeders-path': path.resolve('./src/database/seeders'),
  'migrations-path': path.resolve('./src/database/migrations'),
}
```

we dont use seeders rn, but maybe at some point in the future?

C) Prepare other stuff:

1) Postman - download it and start
2) SQLiteStudio - download and start (link in slack somewhere)

## Execution step

Firstly you need to create model of your database, it can (and must) be done via command:

```sh
npx sequelize-cli model:generate --name TableName --attributes firstAttr:string,lastAttr:string
```
Then file "tablename.js" would appear in src/database/models, and file "XXXXXXNUMBERSXXX-create-tablename.js"
 would appear in src/database/migrations. Unfortunately, you will have to change that file manually, because it is simply
impossible to set up all attributes via one command. And unfortunately this sequelize thingy does not change file in migrations
folder as soon as you change your model. So, my workaround (we can discuss it in details later, but for now it is simple and
working):

1. Change your model file as you like.
2. Copy all your changes to respective fields in migrations file (you will see, it's not hard).

That is a bit "like it shouldnt be", but...

NOTE: ENSURE THAT YOUR TABLE IS NAMED CORRECTLY (NOT IN PLURAL: e.g. not mytableS), coz 
sequelize love changing names to plural. you can add (in your model) this lines:
```sh
    {
        freezeTableName: true,
        timestamps: true,
    });
```
as an options (see my table to recognise it).


So. You have your table, you have migrations. Next up - create physical table, put:

```sh
npx sequelize-cli db:migrate
``` 

If everything was done correctly - check your path, there will be sqlite database.