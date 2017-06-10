//app.js
//Load modules
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
// Object for database for urls, keys are short urls and values are long urls
// b2xVn2 and 9sm5xK provided for the convenience of debugging
const urlDatabase = {
  "b2xVn2": {url:"http://www.lighthouselabs.ca", userID:"ALL"},
  "9sm5xK": {url:"http://www.google.com", userID:"ALL"},
};

//Object for storing all users
const users = {}; //id: 6 alphaneumeric string, email: user email and has '@', password: password in string

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
  res.json(urlDatabase);
});

/*
* GET function to redirect to long url according to short url
* For example, if the long url associated with short url aaaaa1 is www.cbc.ca, www.cbc.ca will be redirected
*/
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if(Object.keys(urlDatabase).indexOf(shortURL) === -1){
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
  const randomString = generateRandomString(randomStringLength);
  urlDatabase[randomString] = {url:req.body.longURL, userID:req.session['user_id']};
  res.redirect("http://localhost:8080/urls/" + randomString);
});

/*
* GET method for deleting a url
* Not accessible if not logged in
 */
app.get("urls/delete",(req,res)=>{
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
  var user = {};
  if(req.session['user_id'] !== undefined){
    user = users[req.session['user_id']];
    userDb = urlsForUser(req.session['user_id'],urlDatabase);
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


/*
* GET method for user registration
* Renders user registration page with
*/
app.get("/user_registration",(req,res)=>{
  res.render("pages/user_registration",{user:{}});
});

/*
* POST method for new user registration
* If user enters an e-mail already existing in our database, reject registration with 403 error
* If user enters valid email address and a nonempy password, accept registration, set user_id cookie,
* login automatically
*/
app.post("/user_registration",(req,res)=>{
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

/*
* POST method to delete an existing url associated with the user
* Upon completion, redirect back to homepage for user
*/
app.post("/urls/:id/delete",(req,res)=>{
  delete urlDatabase[req.params.id];
  let templateVars = { urls: urlDatabase,user:users[req.session['user_id']] };
  res.redirect("/urls");
});

/*
* POST method for changing the associated long url
* Upon compeletion, redirect back to home page
*/
app.post("/urls/:id",(req,res)=>{
  urlDatabase[req.params.id].url = req.body.longURL;
  res.redirect("/urls");
});


/*
* GET method for rendering login page
*/
app.get("/login",(req,res)=>{
  res.render("pages/user_login",{user:{}});
});

/*
* POST method for user log in
* If user enters a valid email and correct password, redirect to /urls (home page),
* If password is wrong, send error message
* If user enters a nonexisting email address, send error message
*/
app.post("/login",(req, res)=>{
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
        return;
      }
    }
  }
  res.status(403).send('No user present');
});

/*
* POST method for log out
* Upon compeletion, clear session and session.sig cookies and redirect to /
*/
app.post("/logout",(req,res)=>{
  res.clearCookie(req.session.user_id);
  res.clearCookie('session');
  res.clearCookie("session.sig");
  res.redirect("/");
})

app.listen(8080); //Using port 8080
console.log('Port 8080 is working');


