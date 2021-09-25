[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Wandir
            
## Description
An app for solo travelers embarking on a trip that helps them connect and meet with other people around the world.

Technologies used:
- Node.js and Express.js to create a RESTful API
- Handlebars.js as the template engine
- MySQL and Sequelize ORM for the database
- Bcrypt to hash user passwords
- Dotenv to store and load environment variables
- AWS SDK and Multer allowing users to upload and update their profile pictures
- Google Maps Location API to autocomplete location entries

## Table of Contents
* [Usage](#usage)
* [Deployment](#deployment)
* [License](#license)
* [Credits](#credits)
* [Questions](#questions)           

## Usage
In order to use all the features of the app, you must first create a profile with your personal information: first and last name, email, age, gender, and location. You will also need to enter a password and select interests from the following: adventure, sports, food, arts and museums, history, nightlife, and wellness. You also have the option of uploading a profile picture and entering a short bio. After creating an account, you will need to login using the email you entered and the password you created.

Once you've made an account and logged in, you can search for events with filters for location and interests. When you click an event, you can see which user created the event, where and when the event takes place, a description of the event, the corresponding interest, a list of users that are attending, and the option to join the event. You also have the option to create your own events. To make an event, you will need to provide a name, description, date, location, and select an interest category.

With an account, you can also search for other users with filters for location, interests, and gender. When clicking another user's profile, in addition to their information, you can also view what events they plan on attending. You also have the option to message other users when viewing their profile. All your previous messages are stored and can be accessed through the message tab in the navbar.

## Deployment
Link to deployed app: https://fullstacknomads.herokuapp.com/
            
## License
Licensed under The MIT License

## Credits
Github: https://github.com/valbona1992

Github: https://github.com/ElijahRomer

Github: https://github.com/ronarceo

Github: https://github.com/opencbct
                 
## Questions
Github: https://github.com/FullstackNomads