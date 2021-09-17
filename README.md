# Covid-19-Location-Tracker 
JavaScript: Website to keep track of your location to avoid COVID-19 Hotspots 

# Demo: 

This is a demo video on every feature of this project: -> https://www.youtube.com/watch?v=gYnWmKfN0Zw

# Introduce the idea of the project: 
This project is about Covid-19 pandemic. The webpage will help the user to see the current hotspots (around the world and around users' area), keep track of the location that they have been to by check-in, then, based on the checkin history, they can press a button to check if they have been near to any hotspot.

How can the users check in a venue/location? 
- We will have a list of venue/location in our database, each venue/location is associated with a check-in code, therefore, when the users visit those venues/locations in our database, the manager of that venue will give them the code of the venue, then the user can open the app and checkin by simply entering that code. 

What if the user visit a venue that is not in our database? 
- We also provide an additional feature for checkin which is check-in by GPS. The users can check in their current location with only a click, no need to entering any code if they don't know the code of the venue. (Note that GPS of some older device might be inaccurate) 

 # 3 types of users and all features: 
 - Normal users account: 
    - Sign up and log in (or log in by gmail).
    - Edit account information
    - See the current hotspots on a map 
    - Click a hotspot on a map to see more information about the hotspot
    - Click a button to move the map to the user's current location to see hotspots around him 
    - Check in by check-in code or check in by GPS
    - See the check-in history on a map with hotspots
    - Check if there is any record of check-in history which is near to any hotspot (call that dangerous record) 
    - See the distance between a dangerous record to the nearest hotspot

- Venue manager account:
    - See the information of the users who have checked in this venue
    - Sign up and log in (or log in by gmail)
    - Edit account information

- Admin account: 
    - Log in & sign up
    - Sign up for another admin
    - See information of all normal user accounts and venue manager accounts
    - Delete an account
    - See all check-in records of all users
    - Manage hotspots information
        - Add/remove a hotspot 
        - Create a hotspot with information: latitude, longitude, active cases, deaths, recovered cases, confirmed cases

# Used framework: 
- Javascript 
- NodeJS, ExpressJS: for server
- Bootstrap, VueJS: for dynamic front-end 
- MySQL for backend (relational database): see the database_info to check the database schema. 

# Files that you need to care: 
These are all the files that you might need to care, others are just configuration files. (installation listed below)

    - stylesheet/style.css: css file for design web page
    - All HTML file in /public: the webpages
    - public/images: images used for front-end 
    - public/javascripts/page.js: all the javascript function for each button in the webpage
    - routes/index.js: how the server will handle request from users
    - routes/users.js: how the server will handle request from users (typically the normal users) 
    - database_info folder: the database schema (how you will design the database), and database dump (constraints between tables and sample data) 
    - app.js: your server setup with some necessary node modules, but this is my setup YOU NEED TO MODIFY THIS FILE

# Installation: 
*Important node: this project was developed on my computer with a MSSQL database , therefore, you need to implement MSSQL database yourself (instruction in data_base_info) and connect the code to database on your computer by modifying app.js file. Steps below are basic steps you need to set up, then you will need to care about the files listed above. 

- Install NodeJS, ExpressJS
- Install MySQL and create a database (check database_info folder) 
- Implement local Express Server
- Connect your server to your database (you might need to change database's setup in app.js)
- Sign up for neccessary APIs: 
    - Google Map API: show the hotspots and checkin records on a map
    - OpenCage Geocoder: get the statename, city, country from latitude, longitude
    - Google Map OAuth API: Login by google account 
- Install some neccessary Node module: (check app.js)
    - MSSQL node module
    - express-session: keep the user logged in when a tab is closed.
    - google-auth-library: google login 
    - bcrypt: hash user password 
    - haversine: get the distance between hotspot to the checkin record 
- Modify the app.js for your setup
- Run your server and start with index.html 

Remember to check files listed above (files you need to care) that are all the files that you need. 

# How to run this project? 
If you are sure that the server and database is good to go, run your server and start with index.html in Covid-19-Location-Tracker folder 



