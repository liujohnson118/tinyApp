# TinyApp Project

This is a full stack web app built with Express and NodeJS that enables users to shorten urls

## Dependencies

   - bcrypt 1.0.2
   - body-parser 1.17.2
   - cookie-parser 1.4.3
   - cookie-session 2.0.0-beta.2
   - ejs 2.5.6
   - express 4.15.3
   - method-override 2.3.9

## Getting started
  - Install all dependencies using `npm install` command
  - Run the development web server using `node app.js` command
  - Open your browser and go to localhost:8080
  - At all times, the logged in user will be displayed in the header. If no user is logged in, the header will display NOT LOGGED IN

## Create new user account

  - In the header, click `Register` button and you will be directed to the register new account page
  !["Screenshot of register page"](https://github.com/liujohnson118/tinyApp/blob/master/docs/tinyApp_register.png)
  - If the user enters an e-mail address without @ or a a password of empty string, the error page for invalid username or password will be displayed
  !["Screenshot of invalid user e-mail or password"](https://github.com/liujohnson118/tinyApp/blob/master/docs/tinyApp_errorInvalidRegister.png)
  - Upon successful registration, the website will automatically log in using the newly registered user

## Home page

  - In the header, there is a button called "Home" that links to the login page if no user is logged in. If there is a user logged in, the "Home" will be lined to `/urls`.

## Your Profile page

  - In the header, there is a button called "Your Profile" that links to `/urls` if there is a user logged in like shown below. There will be pairs of short urls and long urls. The short and long urls are clickable and will redirect user to the associated long url when clicked.
  !["Screenshot of /urls example when logged in"](https://github.com/liujohnson118/tinyApp/blob/master/docs/tinyApp_newUrlAddedShow.png)
  - If no user logged in and "Your Profile" button is clicked then the following error page will be displayed.
  !["Screenshot of error accessing user profile when not logged in"](https://github.com/liujohnson118/tinyApp/blob/master/docs/tinyApp_errorSeeingProfile.png)

## Log In page

  - In the header, the log in page can be accessed by clicking the `Log In` button and the following page will be displayed.
  !["Screenshot of log in page"](https://github.com/liujohnson118/tinyApp/blob/master/docs/tinyApp_login.png)
  - If the user enters an e-mail that has not been registered, the following no user present error page will be displayed.
  !["Screenshot of no user present"](https://github.com/liujohnson118/tinyApp/blob/master/docs/tinyApp_noUser.png)
  - If the password entered on the login page returns false when running bcrypt.compareSync with the stored hashed password generated at registering, the following wrong password page will be displayed
  !["Screenshot of wrong password"](https://github.com/liujohnson118/tinyApp/blob/master/docs/tinyApp_wrongPassword.png)

## Add new url
  - If no user is logged in and the `Add URL` button on the header is clicked, then the following error page will be displayed
  !["Screenshot of error adding url before login"](https://github.com/liujohnson118/tinyApp/blob/master/docs/tinyApp_errorAddUrlBeforeLogIn.png)
  - If logged in, the following page will be displayed for the user to add a url with `http://` at the beginning
  !["Screenshot of adding new url"](https://github.com/liujohnson118/tinyApp/blob/master/docs/tinyApp_addNewUrl.png)
  - Once the user has added a new url, the short url generated for the newly added url will be displayed together with the newly added url. If the user would like to change the long url, he or she has the option to do so as shown below.
  !["Screenshot of new url added"](https://github.com/liujohnson118/tinyApp/blob/master/docs/tinyApp_newUrlAdded.png)
  - At this point, if the user goes to his or her profile page, the url added should be displayed.
  !["Screenshot of user profile after new url added"](https://github.com/liujohnson118/tinyApp/blob/master/docs/tinyApp_newUrlAddedShow.png)

## Delete url
  - Once logged in, the user can delete a url in his or her profile page by clicking the `Delete` button.

## Update url
  - Once logged in, the user may update the url of a given short url in his or her profile by clicking the `Update` button and following subsequent prompts.

## Redirecting using url

  - If a url has been stored in our database, the user may simply type `localhost:8080/u/xxxxxx` to be redirected to the associated long url where `xxxxxx` is the associated short url regardless of login status

  - If `xxxxxx` is a short url not stored in the database, then the following error page will be displayed
  !["Screenshot of short url does not exist"](https://github.com/liujohnson118/tinyApp/blob/master/docs/tinyApp_errorShortUrlDNE.png)

## Requesting to see short and long url pairs

  - When logged in, the user may type into the browser `localhost:8080/urls/xxxxxx` where xxxxxx is a stored short url in his or her profile. Then, the short url and associated long url will be displayed to the user.
  - If the short url is not stored in his or her profile, error page will be displayed.
  - If the user requests `localhost:8080/urls/xxxxxx` without logging in first, an error page telling the user to login first will be displayed.

