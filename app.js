// server.js
// load the things we need
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const cookieParser=require('cookie-parser');
const methodOverride = require('method-override')
const cookieSession = require('cookie-session');
const randomStringLength = 6;
const bcrypt = require('bcrypt');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use
app.use(methodOverride());
app.use(cookieSession({
  secret: 'Vancouver downtown',
}));
// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file
//Database for urls, keys are short urls and values are long urls
const urlDatabase = {
  "b2xVn2": {url:"http://www.lighthouselabs.ca", userID:"ALL"},
  "9sm5xK": {url:"http://www.google.com", userID:"ALL"},
  "lexus1": {url:"http://www.lexus.com",userID:"lexus"}
};

const users = {}; //id: 6 alphaneumeric string, email: user email and has '@', password: password in string

/*
* Function to simulate sleeping or holding execution of next line of code
* input: milliseconds - time to sleep in milliseconds
*/
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

/*
* function to generate a random alphaneumeric string of a certain length
* Input: length - length of random string to be generated
* Return: text - random string of length specified generated
*/
function generateRandomString(length){
  var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < length; i++ ){
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

/*
* function to subset a url data base according to user ID
* input: id - id of user
* input: db - url database to be subsetted
* return: subsetted url database of input db according to user ID id
*/
function urlsForUser(id,db){
  urlsForThisUser = {};
  for(shortURL in urlDatabase){
    if(db[shortURL].userID === id){
      urlsForThisUser[shortURL] = {url:urlDatabase[shortURL].url, userID:id};
    }
  }
  return urlsForThisUser;
}


/*
* GET function to render the page with all existing urls and their shortened version
* The rendered page dispalys all short and long urls created by all users but does not allow updating
* or deleting. If logged in, the user may update/delete individual urls in the HOME page
*/
app.get("/", (req, res) => {
  console.log("/ is used");
  if(req.session.user_id !== undefined){
    res.redirect("/urls");
  }else{
    res.redirect("/login");
  }
});

/*
* GET function to render a page of exisiting url database into JSON format
*/
app.get("/urls.json", (req, res) => {
  console.log("/urls.json used");
  res.json(urlDatabase);
});

//Another greeting
app.get("/hello", (req, res) => {
  console.log("hello used");
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

/*
* GET function to redirect to long url according to short url
* For example, if the long url associated with short url aaaaa1 is www.cbc.ca, www.cbc.ca will be redirected
*/
app.get("/u/:shortURL", (req, res) => {
  console.log("get short url used");
  const shortURL = req.params.shortURL;
  if(Object.keys(urlDatabase).indexOf(shortURL)===-1){
    res.status(403).send("The short url does not exist!")
  }else{
    const longURL = urlDatabase[shortURL].url;
    res.redirect(longURL);
  }
 });


/*
* GET function for adding a new url to database
* If logged in, the user can follow prompts to add a new url
* If not logged in, the user will be redirected to the login page
*/
app.get("/urls/new", (req, res) => {
  console.log("urls/new used");
  var user = {};
  if(req.session['user_id'] !== undefined){
    user = users[req.session['user_id']];
    res.render("pages/urls_new",{user:user});
  }else{
    res.status(403).send("Error: Please log in first before you can add a new url");
  }
});

/*
* POST method for creating a new URL
* This post method can only be used when the user has logged in and is on pages/urls_new
*/
app.post("/urls/new", (req, res) => {
  console.log("/urls/new post used");
  const randomString = generateRandomString(randomStringLength);
  urlDatabase[randomString] = {url:req.body.longURL, userID:req.session['user_id']};
  res.redirect("http://localhost:8080/urls/" + randomString);
});

/*
* GET method for deleting a url
* Not accessible if not logged in
 */
app.get("urls/delete",(req,res)=>{
  console.log("delete used");
  var user = {};
  if(req.session['user_id'] !== undefined){
    user = users[req.session['user_id']];
  }
  res.render("pages/urls_index",{user:user});
});

/*
* GET show a particular long url associated with a short url
* If logged in, the user has the option to update the long url associated with the short url
* If the logged in user does not own the short url requested, error is returned
* Not invokable if not logged in
*/
app.get("/urls/:id", (req, res) => {
  console.log("short url id used");
  var user = {};
  if(req.session['user_id'] !== undefined){
    user = users[req.session['user_id']];
    userDb=urlsForUser(req.session['user_id'],urlDatabase);
    if(Object.keys(userDb).indexOf(req.params.id) !== -1){
      let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id].url, user:user};
      res.render("pages/urls_show", templateVars);
    }else{
      res.status(404).send("Error: the short url you requested is not in your url database");
    }
    return;
  }else{
    res.status(403).send("Error: Please log in first before you can update an existing url");
  }
});

/*
* GET method for a logged in user's urls
* If not logged in, error is sent
*/
app.get("/urls", (req, res) => {
  var user = users[req.session['user_id']];;
  if(user){
    db = urlsForUser(req.session['user_id'],urlDatabase);
    res.render("pages/urls_index",{urls: db,user:user});
  }else{
    res.status(404).send("Error: Please login before you can see your urls!");
  }
});


//User registration
app.get("/user_registration",(req,res)=>{
  console.log("user registration get used")
  var user = {};
  res.render("pages/user_registration",{user:user});
});

//Create new user
app.post("/user_registration",(req,res)=>{
  console.log("user_registration post used")
  const userRandomID = generateRandomString(randomStringLength);
  for(var userID in users){
    if(users[userID].email === req.body.email){
      res.status(403).send('Error: User email already exists! Please select a new one!');
      return;
    }
  }
  if(req.body.email.indexOf('@') === -1 || req.body.password === ''){
    res.send('Error: Invalid entry of email or password', 404);
  }else{
    users[userRandomID] = {id: userRandomID, email: req.body.email, password: bcrypt.hashSync(req.body.password,10)};
    req.session.user_id = userRandomID;
    res.redirect("/");
  }
});

//Delete an entry in url database
app.post("/urls/:id/delete",(req,res)=>{
  console.log("delete entry post used");
  delete urlDatabase[req.params.id];
  let templateVars = { urls: urlDatabase,user:users[req.session['user_id']] };
  res.redirect("/urls");
});

//Show a paritcular url entry in database
app.post("/urls/:id",(req,res)=>{
  console.log("url id post used");
  urlDatabase[req.params.id].url = req.body.longURL;
  res.redirect("/urls");
});


//Login get
app.get("/login",(req,res)=>{
  console.log("login get used");
  res.render("pages/user_login",{user:{}});
});

//Login post
app.post("/login",(req, res)=>{
  console.log("login post used");
  allIds = Object.keys(users);
  for (var userID in users) {
    var user = users[userID];
    if(user.email === req.body.useremail){
      if(bcrypt.compareSync(req.body.userpassword, user.password)){
        req.session.user_id = userID;
        console.log("Encrpted user ID is: " + req.session.user_id);
        res.redirect('/urls');
        return;
      }else{
        res.status(403).send('Wrong password');
      }
    }
  }
  res.status(403).send('No user present');
});

//Logout
app.post("/logout",(req,res)=>{
  console.log("logout post used");
  res.clearCookie(req.session.user_id);
  res.clearCookie('session');
  res.clearCookie("session.sig");
  res.redirect("urls");
})

app.listen(8080);
console.log('Port 8080 is working');


