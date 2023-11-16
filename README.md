# Eventer – California

https://github.com/parkshub/eventer-react-redux/assets/87814883/50f2aa48-d975-4f09-8c66-8d3190ffc716

### Please feel free to test out the site using username: test@test.com password: test

## Introduction

####             This web application allows users to create and attend events, albeit limited to California. When posting an event, users upload a picture representative of the event and a short description of what’s expected—expenses, necessary items, etc. The creator may also edit or delete the event page except when the event has already occurred. On the event page, users can see the profile pictures of other attendees. When clicked, they’ll be redirected to the user’s profile. There, they’ll be able to browse other events the user is attending and events the user is hosting. While that’s one way to browse the available events, events are also displayed on the Home and Browse pages. The Home page displays the top 4 events ranked by attendees, whereas the Browse page displays all the events. On the Browse page, users can also filter through events depending on the city it’s taking place. Another notable function is the user’s ability to upload their own photo or choose a default profile picture, a colored circle with their initials in the middle, much like Google’s profile picture. However, unlike Google, users can change the color of the circle.
####             Eventer was built using MongoDB, Express, React, and Node (MERN stack) alongside Redux. My main inspiration for creating this project was COVID. In Seoul, South Korea, stay-at-home orders were lifted; however, a curfew and a gathering size limit were still in place. Living in a big city is isolating in itself, only to be exacerbated by COVID restrictions. An application like Eventer could help bring people together.
#### URL: https://eventer-california-usa.herokuapp.com/

## Lessons Learned and Optimizations
####             This project was designed using the model-view-controller architecture. Despite thorough planning of its architecture and models, there were several areas for improvement. Instead of setting up the models’ schemas to act like a relational database (i.e., creating references to other collections), I stored as much data into one document leading to convoluted functions, especially for deletes and updates, which led to the application breaking. Subsequently, I fixed my models’ schemas and controllers to act more like a relational database using “populate.”
####             Another issue I faced was how I assigned promise states to the Redux store. Instead of assigning promise states of each asyncThunk function to a different variable, they all shared the same variable. This caused issues when rendering loading screens. The application would alternate between the actual page and the loading screen when different page components finished loading at different times. Furthermore, all of my useEffect functions were lumped into one useEffect hook. This also resulted in my page rendering multiple times, adding to the issue of flashing loading screens. Most of these issues have been resolved in my next project—Portfolio Tracker—and have been partially resolved for this project.

## Future Aspirations
####             Given more time and resources, I would have loved to have added more to my web application. First, I would have liked to have included other states besides California. Lastly, I would have liked to add a content-based recommendation system using a collaborative learning algorithm (Low-rank matrix factorization). For successful implementation, some extra features need to be added. Events should be categorized into event types (e.g., outdoor activity, socializing, etc.). Users should also be able to rate events they’ve attended and their hosts.
####	Additionally, data should be collected on the user’s approximate location and the size of events they’ve been attending, to name a few. To get an initial sense of users’ preferences, they’d be asked which type of events they are most interested in (size of event, event category, etc.) on registration. Using the user’s preferences as the features, I believe I’ll be able to create a decent algorithm over time. With this recommender’s system, I’ll also be able to create a “Feeds” page where the content is more personalized.





# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
