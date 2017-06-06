// server.js
// load the things we need
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const randomStringLength=6;
app.use(bodyParser.urlencoded({extended: true}));

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "lexus1": "http://www.lexus.ca",
};

function generateRandomString(length){
  var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ ){
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL=req.params.shortURL.substring(1);
  const longURL=urlDatabase[shortURL];
  res.redirect(longURL);
 });

// about page
app.get('/about', function(req, res) {
    res.render('pages/about');
});

app.get("/urls/new", (req, res) => {
  res.render("pages/urls_new");
});

app.post("/urls", (req, res) => {
  //console.log(req.body.longURL);  // debug statement to see POST parameters
  const randomString = generateRandomString(randomStringLength);
  urlDatabase[randomString]=req.body.longURL;
  res.send(randomString);         // Respond with 'Ok' (we will replace this)
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id.substring(1), longURL: urlDatabase[req.params.id.substring(1)] };
  res.render("pages/urls_show", templateVars);
});

app.listen(8080);
console.log('8080 is the magic port');


