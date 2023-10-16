### today I learn

# node.js and express.js

Node.js : Node.js is an opensource, crossplatform,js runtime environment that executes JS code outside of a browser. We can use JS in the serverside thanks to Node.js.

Express.js : Express.js is a web application framework for Node.js, it makes us easy to make a website or an app.

Download Node.js after checking if you already have it by using `node -v`.  
`npm init`  
check package.json  
index.js : starting point of backend  
Download express.js by using `npm install express --save`  
node_modules : this folder contains downloaded dependencies.  
make a basic express.js app by using https://expressjs.com/en/starter/hello-world.html. Insert "start" : "node index.js" in the scripts of package.json.  
`npm run start`  
`lsof -i :port`  
`kill -9 PID`

# connect MongoDB

download MongoDB  
sign up for using it  
make a cluster  
create mongoDB user(you have to memorize id and pw to make a connection between your app and mongoDB)  
download mongoose(`npm install mongoose --save`)  
connect app to MongoDB  
check if it works well

# body-parser :

Express body-parser is an npm module used to process data sent in an HTTP request body.  
It provides four express middleware for parsing JSON, Text, URL-encoded, and raw data sets over an HTTP request body. Before the target controller receives an incoming request, these midDdleware routines handle it.  
`npm install body-parser --save`

# nodemon :

Nodemon reboots your server needless to shut it down when we change your source code and save it.  
`npm install nodemon --save-dev`  
After installing it, you should change scripts in package.json  
`"nodemon" : "nodemon index.js"`  
let's test with `npm run nodemon`

# protect secret information

If we upload our source code to GitHub, everybody can know our secret information.  
So, in order for us to protect this, we can put all secret information in a file(here it's dev.js) and we put that file's information into '.gitignore' file. The way to protect it could be changed depending on development environment(LOCAL or DEPLOY mode). For example, Heroku service deployment.

# Bcrypt

reason to use Bcrypt : when you see a password like '12345678' in the DB, it looks risky to be exposed. By using Bcrypt, you can encrypt this password before saving to the DB.  
`npm install bcrypt --save`  
'/register' route -> before saving user information, encrypte the information.  
'saltRounds = 10' means how many letters salt has. By using this salt, we can encrypt the password.  
"""
const saltRounds = 10;  
userSchema.pre("save", function (next) {  
//encrypte your password before saving it to the DB  
var user = this;

if (user.isModified("password")) {  
bcrypt.genSalt(saltRounds, function (err, salt) {  
if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });

}  
});  
"""

userSchema.pre("save", function(next){  
something to do before saving  
})

The above function means that we need to do something before 'save'.  
In this case, before saving it to DB, we need to encrypte plain password.

# Make a log-in function

make 'login' route  
find an email by using `User.findOne()`  
if there is the email, you need to check if the plain password is the same as hashed password.  
if the password is matched, make a Token by using JSONWEBTOKEN(download jsonwebtoken)  
`npm install jsonwebtoken --save` -> https://www.npmjs.com/package/jsonwebtoken

WHY use JWT?
JWT is a token-based authentication to authenticate and identify users.
The token itself contains the user's authorization information or information for using the service.
Using JWT, user data can be exchanged in a stateless environment such as RESTful.

user.save 에 대해 알아보기
Now, callback function is deprecated.

노드 리액트 기초강의 #12 토큰생성 with jsonwebtoken 까지 한 후 실행시 에러메세지

[nodemon] restarting due to changes...  
[nodemon] starting `node index.js`  
Example app listening on port 5000  
MongoDB Connected...  
MongooseError: Model.findOne() no longer accepts a callback  
at Function.findOne (/Users/hojunhwang/Documents/gitfth/hojun_portfolios/boiler_plate/node_modules/mongoose/lib/model.js:2184:11)  
at /Users/hojunhwang/Documents/gitfth/hojun_portfolios/boiler_plate/index.js:59:8  
at Layer.handle [as handle_request] (/Users/hojunhwang/Documents/gitfth/hojun_portfolios/boiler_plate/node_modules/express/lib/router/layer.js:95:5)  
at next (/Users/hojunhwang/Documents/gitfth/hojun_portfolios/boiler_plate/node_modules/express/lib/router/route.js:144:13)  
at Route.dispatch (/Users/hojunhwang/Documents/gitfth/hojun_portfolios/boiler_plate/node_modules/express/lib/router/route.js:114:3)  
at Layer.handle [as handle_request] (/Users/hojunhwang/Documents/gitfth/hojun_portfolios/boiler_plate/node_modules/express/lib/router/layer.js:95:5)  
at /Users/hojunhwang/Documents/gitfth/hojun_portfolios/boiler_plate/node_modules/express/lib/router/index.js:284:15  
at Function.process_params (/Users/hojunhwang/Documents/gitfth/hojun_portfolios/boiler_plate/node_modules/express/lib/router/index.js:346:12)  
at next (/Users/hojunhwang/Documents/gitfth/hojun_portfolios/boiler_plate/node_modules/express/lib/router/index.js:280:10)  
at cookieParser (/Users/hojunhwang/Documents/gitfth/hojun_portfolios/boiler_plate/node_modules/cookie-parser/index.js:57:14)

오리지널 코드 부분에 에러발생 코드가 있는데 아래와 같이 고치면 된다.  
var token = jwt.sign(user.\_id, "secretToken");  
=>  
var token = jwt.sign(user.\_id.toHexString(), "secretToken");
