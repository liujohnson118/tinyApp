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
