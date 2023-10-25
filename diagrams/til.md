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

오리지널 코드의 콜백함수를 제거하고, 기능은 기본 강의와 동일하게 기능하도록 코드를 고쳤음.

# Make a authentication function

rewrite routes like from '/register' to '/api/users/register'.

difference between 'get' and 'post'???

difference between 'var', 'let' and 'const'???  
var는 전역범위 혹은 함수범위에서 사용된다. 재선언되고, 업데이트 될 수 있다.  
let은 블록범위, 하나의 블록은 중괄호 {} 속에 존재하며, 해당 중괄호 안에 있는 것은 모두 블록범위이다.  
let은 업데이트 될 수는 있지만, 범위 내에서 재선언은 불가능하다.  
const는 블록범위이다. 업데이트도 재선언도 불가능하다. const 개체는 업데이트 할 수 없지만, 개체의 속성은 업데이트 가능하다.

const greeting = {  
 message: "say Hi",  
 times: 4  
}  
에서  
greeting = {  
 words: "Hello",  
 number: "five"  
} // error: Assignment to constant variable.

로 업데이트는 불가능하지만,  
greeting.message = "say Hello instead";  
은 가능하다.

difference between UserSchema.statics and UserSchema.methods??  
statics에서 this는 user collection 전체를 의미하지만, methods에서의 this는 document 하나만을 의미한다.

# log out 기능 만들기

Make logout route  
Remove the user's token after searching the user who want to log out in the DB.

로그아웃시, 왜 토큰을 지워주면 되는가?
데이터베이스의 토큰을 지워주면, 인증이 안 되서 로그인 기능이 풀려버리기 때문임.

index.js의 logout 라우터에서 \_id를 통해 토큰을 지우려고 하는 기능이 안됨.
->
console.log로 원인 찾기 시작
->
findByToken의 findOne 함수 사용시 async, await 사용하여 문제 해결

User.js의 findByToken에서 findOne 함수를 통해 found 변수를 구할 때 await, async를 사용하지 않아서
found가 Promise { <pending>} 처리 되어서, index.js의 logout 라우터에서 \_id를 통해 토큰을 지우려고 하는 기능이 안됨.
doc이 계속 null로 나옴.

# ReactJS

현재까지는 한 것들은 server쪽 작업이다. 그러므로 server directory를 만들어서 그 서버에 넣는다.  
client directory 만들어서 앞으로 할 프론트엔드 부분을 그 안에서 진행시키면 된다.

`npx create-react-app .`

`npm start`  
Starts the development server.

`npm run build`  
Bundles the app into static files for production.

`npm test`  
Starts the test runner.

`npm run eject`  
Removes this tool and copies build dependencies, configuration files  
and scripts into the app directory. If you do this, you can’t go back!

처음 npm start 실행하고,
index.js 파일을 살펴보면,
index.html 부분의 root 부분을 이용해서 app.js를 보여주는 것임을 알 수 있다.

번외로 webpack의 영향범위는 src directory 이므로 이미지 등을 저장할 때는 public directory가 아닌 src directory에 저장하는 것이 맞다.

# App.js Route ( React Router Dom )

when we go to another page, we need React Router DOM  
(https://reactrouter.com/en/main) <- 튜토리얼이 많이 바뀜

Switch 대신에 Routes를 써야함. 튜토리얼 대신 네이버에 react-router-dom 검색하면 다양한 예제 나옴.
Download dependency with `npm install react-router-dom --save`

react-router-dom documentation 복사하고 붙여넣기 해서 조금 바꾸면서 테스트 해보면 되는 것인데,  
현재 사이트가 많이 바뀌어서 그냥 수업 내용 보고 베껴서 코드 작성함.

# -------- server 폴더로 백엔드 파일 옮겨서 npm run start 실행하니 아래와 같은 에러... ---------------

Error: Cannot find module '../models/User'  
Require stack:

- /Users/hojunhwang/Documents/gitfth/hojun_portfolios/boiler_plate/server/index.js
  at Function.Module.\_resolveFilename (node:internal/modules/cjs/loader:933:15)
  at Function.Module.\_load (node:internal/modules/cjs/loader:778:27)
  at Module.require (node:internal/modules/cjs/loader:999:19)
  at require (node:internal/modules/cjs/helpers:102:18)
  at Object.<anonymous> (/Users/hojunhwang/Documents/gitfth/hojun_portfolios/boiler_plate/server/index.js:5:18)
  at Module.\_compile (node:internal/modules/cjs/loader:1097:14)
  at Object.Module.\_extensions..js (node:internal/modules/cjs/loader:1151:10)
  at Module.load (node:internal/modules/cjs/loader:975:32)
  at Function.Module.\_load (node:internal/modules/cjs/loader:822:12)
  at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:77:12) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
  '/Users/hojunhwang/Documents/gitfth/hojun_portfolios/boiler_plate/server/index.js'
  ]

  Module_Not_Found error.  
  Error: Cannot find module '../models/User' 로 가서 경로를 잘 설정해주면 된다.  
  이번에 server directory를 만들어서 파일을 옮겨주는 과정에서 path 설정이 잘 안 되어서 발생한 문제인 듯.

# data request, response flow and axios

서버와 클라이언트의 port를 맞춰주어야 함.  
현재 서버는 5000번, 클라이언트는 3000번인 상태.  
두 개의 다른 포트를 가지고 있기 때문에 클라이언트에서 아무 설정 없이 request를 보낼 수 없는데, 그 이유는 CORS(cross origin resource sharing) 때문임. 이것은 보안을 위한 것인데 이것을 해결하는 방법은 proxy 임.

`npm install axios --save` 로 일단 axios 다운로드.

# ---- ERROR ----

"""  
Request failed with status code 404  
AxiosError: Request failed with status code 404  
"""

function LandingPage() {  
 useEffect(() => {  
 axios.get("/api/hello").then((response) => console.log(response));  
 }, []);  
 return <div>LandingPage</div>;  
}

LandingPage에서 request를 보냈지만, 이것은 포트 3000번으로 request를 보내는 것이기 때문에 5000번 포트를 사용하는 서버에서는 해당 request를 받지 못함. 그래서 404 error code 발생하는 것임(404 : 사용자가 사이트에서 존재하지 않는 URL을 탐색했을 때 발생할 수 있음).

/api/hello => http://localhost:5000/api/hello로 변경 후 다시 한번 npm run start.  
Access to XMLHttpRequest at 'http://localhost:5000/api/hello' from origin 'http://localhost:3003' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.  
CORS 관련 에러 발생.

해결하는 방법은 여러가지가 있을 수 있는데, proxy를 사용해서 해결.

---

proxy 관련 정보  
https://create-react-app.dev/docs/proxying-api-requests-in-development/

`npm install http-proxy-middleware --save` 다운로드

`관련 정보 사용하여 src/setupProxy.js 작성한다.`

USER <=> proxy server <=> Internet
advantage :

1. 방화벽 기능
2. 웹 필터 기능
3. 캐쉬데이터, 공유데이터 제공 기능

# Concurrently

`https://www.npmjs.com/package/concurrently`  
concurrently 사용하여 프론트엔드와 백엔드 동시에 켜기  
`"dev" : "concurrently \"npm run server\" \"cd ../client && npm run client\""`

# CSS Ant design

CSS framework 사용하는 이유. 기능 위주의 코딩을 할 수 있음.
종류 : Material UI, React Bootstrap, Semantic UI, Ant Design, Materialize

`https://ant.design/`
사이즈 큼. 엔터프라이즈 환경에서도 사용가능. 사용하기 쉽다. 스타일 깔끔.

`npm install antd --save` 다운로드 후,

# Redux setting

다운 받아야 할 dependencies.  
redux, react-redux, redux-promise, redux-thunk

`npm install redux react-redux redux-promise redux-thunk`

# login page with Redux

# ------- ERROR -------------

the below code is now working after copying the code of this course.  
// props.history.push("/");  
// => import {useNavigate} from 'react-router-dom';  
// const navigate = useNavigate();  
// props.history.push('/') => navigate('/')  
// because of the replacement of library version, it changed from useHistory to useNavigate  
// At present, no more withRouter, useHistory

# ------- ERROR -------------

[1] [eslint]  
[1] src/\_reducers/user_reducer.js  
[1] Line 3:1: Unexpected default export of anonymous function import/no-anonymous-default-export  
[1] Line 7:7: Unreachable code no-unreachable

It's an ERROR because of ES Lint. Just make a name for this anonymous function. That's it.

# register page, log out page

Register page is the same as login page

1. making a fronend by using html, css(form, input, label, css)
2. by using useState, we control each state in each input(email, password etc)
3. making a function for each onChange in the input tag
4. by using dispatch(useDispatch from react-redux), do the action!
5. by using navigate(useNavigate from react-router-dom), redirect the page into the login page

Log out page,

1. make a button in the LandingPage
2. make a function when you click the button
3. by using axios.get, we remove the token from user and redirect the page into the login page.

# HOC(Higher Order Component)

들어갈 수 있는 페이지들에 대한 통제는 HOC(Higher Order Component)를 통해 한다  
HOC : A function that takes a component and returns a new component  
const EnhancedComponent = higherOrderComponent(WrappedComponent);  
즉, /hoc/auth.js 에서 해당 유저가 해당 페이지에 들어갈 자격이 되는지 알아낸 후에, 자격이 되면 들여보내 주고 아니면 다른 페이지로 보내버리는 것

# ----- ERROR -----

- Warning: Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.
- const dispatch = useDispatch(); 를 제일 윗단으로 올리니까 아래 에러가 나옴  
  Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:

1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
   See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.

해결방법
hoc/auth.js 의 무기명 함수에 이름을 넣어서 기명함수로 만들어준다.
아래와 같이 각 페이지에서 export 전에 Auth로 감싸준다.
/src/view/RegisterPage
export default Auth(RegisterPage, false);
/src/view/LandingPage
export default Auth(LandingPage, null);
/src/view/LoginPage
export default Auth(LoginPage, false);

# ------- important ----------

It’s not supported to call Hooks (functions starting with use) in any other cases, for example:

🔴 Do not call Hooks inside conditions or loops.  
🔴 Do not call Hooks after a conditional return statement.  
🔴 Do not call Hooks in event handlers.  
🔴 Do not call Hooks in class components.  
🔴 Do not call Hooks inside functions passed to useMemo, useReducer, or useEffect.
