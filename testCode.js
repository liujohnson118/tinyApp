var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "lexus1": "http://www.lexus.ca",
};

var obj={urls:urlDatabase}
var myObj=obj["urls"];
Object.keys(myObj).forEach(function(key,index){
  console.log("Index: "+index+" Key "+key+" value "+ myObj[key]);
})

// Object.keys(urlDatabase).forEach(function(key,index){
//   console.log("Index: "+index+"Key "+key+"Value "+urlDatabase[key]);
// })
