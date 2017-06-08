// server.js
// load the things we need
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const cookieParser=require('cookie-parser');
const methodOverride = require('method-override')
const randomStringLength=6;
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride());
// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file
//Database for urls, keys are short urls and values are long urls
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users={}; //id: 6 alphaneumeric string, email: user email and has '@', password: password in string

function generateRandomString(length){
  var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < length; i++ ){
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

//Just for greatings
app.get("/", (req, res) => {
  console.log("/ is used");
  var user;
  if(req.cookies['user_id']!==undefined){
    user=users[req.cookies['user_id']];
  }
  console.log(req.cookies['user_id']);
  console.log(user);
  res.render("pages/urls_index",{urls:urlDatabase,user:user});
});

//Put the url database into JSON format
app.get("/urls.json", (req, res) => {
  console.log("/urls.json used");
  res.json(urlDatabase);
});

//Another greeting
app.get("/hello", (req, res) => {
  console.log("hello used");
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

//Redirect to long url according to short url
app.get("/u/:shortURL", (req, res) => {
  console.log("get short url used");
  const shortURL=req.params.shortURL;
  const longURL=urlDatabase[shortURL];
  res.redirect(longURL);
 });

// about page
app.get('/about', function(req, res) {
    console.log("about used");
    let user={user: users[req.cookies['useremail']]}
    res.render('pages/about',templateVars);
});

//Add new url
app.get("/urls/new", (req, res) => {
  console.log("urls/new used");
  let user={user: users[req.cookies['user_id']]}
  res.render("pages/urls_new",user);
});

//Delete url
app.get("urls/delete",(req,res)=>{
  console.log("delete used");
  let user={user: users[req.cookies['user_id']]}
  res.render("pages/urls_index",user);
});

//Show a particular object with short url
app.get("/urls/:id", (req, res) => {
  console.log("short url id used");
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id],useremail: req.cookies['useremail'] };
  res.render("pages/urls_show", templateVars);
});

//urls page
app.get("/urls", (req, res) => {
  var user;
  if(req.cookies['user_id']!==undefined){
    user=users[req.cookies['user_id']];
  }
  console.log(user);
  res.render("pages/urls_index",{urls:urlDatabase,user:user});
});

//Update long url for a short url
app.post("/urls", (req, res) => {
  console.log("/urls post used");
  const randomString = generateRandomString(randomStringLength);
  urlDatabase[randomString]=req.body.longURL;
  res.redirect("http://localhost:8080/urls/"+randomString);         // Respond with random string generated
});

//User registration
app.get("/user_registration",(req,res)=>{
  console.log("user registration get used")
  let templateVars = { urls: urlDatabase, useremail: req.cookies['useremail'] };
  res.render("pages/user_registration",templateVars);
});

//Create new user
app.post("/user_registration",(req,res)=>{
  console.log("user_registration post used")
  const userRandomID=generateRandomString(randomStringLength);
  for(var userID in users){
    if(users[userID].email===req.body.email){
      res.status(403).send('User email already exists! Please select a new one!');
      return;
    }
  }
  if(req.body.email.indexOf('@')===-1 || req.body.password===''){
    res.send('Invalid entry of email or password', 404);
  }else{
    users[userRandomID]={id: userRandomID, email: req.body.email, password: req.body.password};
    res.cookie(userRandomID,userRandomID);
    res.redirect("/");
  }
});

//Delete an entry in url database
app.post("/urls/:id/delete",(req,res)=>{
  console.log("delete entry post used");
  delete urlDatabase[req.params.id];
  let templateVars = { urls: urlDatabase,user:users[req.cookies['user_id']] };
  res.redirect("/urls");
});

//Show a paritcular url entry in database
app.post("/urls/:id",(req,res)=>{
  console.log("url id post used");
  urlDatabase[req.params.id]=req.body.longURL;
  res.redirect("/urls/"+req.params.id);
});


//Login get
app.get("/login",(req,res)=>{
  console.log("login get used");
  res.render("pages/user_login");
});

//Login post
app.post("/login",(req, res)=>{
  console.log("login post used");
  allIds=Object.keys(users);
  for (var userID in users) {
    var user=users[userID];
    console.log(user);
    if(user.email===req.body.useremail){
      res.cookie('user_id',userID);
      res.redirect('/');
      return;
    }
  }
  res.status(403).send('No user present');
});

//Logout
app.post("/logout",(req,res)=>{
  console.log("logout post used");
  res.clearCookie('user_id');
  res.redirect("urls");
})

app.listen(8080);
console.log('Port 8080 is working');


