### today I learn

# body-parser :

Express body-parser is an npm module used to process data sent in an HTTP request body.
It provides four express middleware for parsing JSON, Text, URL-encoded, and raw data sets over an HTTP request body. Before the target controller receives an incoming request, these middleware routines handle it.
`npm install body-parser --save`

# nodemon :

Nodemon reboots your server needless to shut it down when we change your source code and save it.
`npm install nodemon --save-dev`
After installing it, you should change scripts in package.json
`"nodemon" : "nodemon index.js"`
let's test with `npm run nodemon`

# protect secret information

If we upload our source code to GitHub, everybody can know our secret information.
So, in order for us to protect this, we can put all secret information in a file and we put that file's information into '.gitignore' file. The way to protect it could be changed depending on development environment(LOCAL or DEPLOY mode). For example, Heroku service deployment.
