// server.js
// load the things we need
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const cookieParser=require('cookie-parser');
const randomStringLength=6;
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


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
  res.end("Hello I'm Johnson Liu!");
});

//Put the url database into JSON format
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//Another greeting
app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

//Redirect to long url according to short url
app.get("/u/:shortURL", (req, res) => {
  const shortURL=req.params.shortURL;
  const longURL=urlDatabase[shortURL];
  res.redirect(longURL);
 });

// about page
app.get('/about', function(req, res) {
    let templateVars={username: req.cookies['username']}
    res.render('pages/about',templateVars);
});

//Add new url
app.get("/urls/new", (req, res) => {
  let templateVars={username: req.cookies['username']}
  res.render("pages/urls_new",templateVars);
});

//Delete url
app.get("urls/delete",(req,res)=>{
  let templateVars={username: req.cookies['username']}
  res.render("pages/urls_index",templateVars);
});

//Show a particular object with short url
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id],username: req.cookies['username'] };
  res.render("pages/urls_show", templateVars);
});

//urls page
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies['username'] };
  res.render("pages/urls_index", templateVars);
});

//Update long url for a short url
app.post("/urls", (req, res) => {
  const randomString = generateRandomString(randomStringLength);
  urlDatabase[randomString]=req.body.longURL;
  res.redirect("http://localhost:8080/urls/"+randomString);         // Respond with random string generated
});

//Delete an entry in url database
app.post("/urls/:id/delete",(req,res)=>{
  console.log(req.params.id);
  delete urlDatabase[req.params.id];
  let templateVars = { urls: urlDatabase };
  res.redirect("/urls");
});

//Show a paritcular url entry in database
app.post("/urls/:id",(req,res)=>{
  urlDatabase[req.params.id]=req.body.longURL;
  res.redirect("/urls/"+req.params.id);
});

//Loigin cookie
app.post("/login",(req, res)=>{
  res.cookie('username',req.body.name,{ expires: new Date(Date.now() + 30000), httpOnly: true });
  res.redirect("/urls");
});

//Logout
app.post("/logout",(req,res)=>{
  res.clearCookie('username');
  res.redirect("urls");
})

app.listen(8080);
console.log('Port 8080 is working');


