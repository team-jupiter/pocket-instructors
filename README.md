# Pocket-Instructors

Pocket Instructors is a full stack mobile application akin to Pokemon Go. See monsters (sprites made using Fullstack Academy instructors) spawn on a real-time map, capture them to build a winning team, and battle your friends to prove you're the best there is!


---

## Getting started

For iOS and/or Android users -

1. Clone this repository and run _**EITHER**_ ```npm install``` or ```yarn add```
2. Download the Expo Go app from the app store
3. Set up ngrok on your machine - [Instructions found here](https://dashboard.ngrok.com/get-started/setup)
4. Follow the steps below to launch the application -
    1. Run ```npm run socket-server```
    2. In a terminal, switch to the directory where you've set up ngrok. Run ```./ngrok http 3000```
    3. Running the above command will output a forwarding address (e.g. ```http://401d1312c6.ngrok.io```) in the terminal. In ```/screens/Map.js```, replace the URL that the socket is connected to with your ngrok address (e.g. ```let socket = io.connect("http://401d1312c6.ngrok.io")```)
5. Switch your terminal back to this project's directory. Run ```expo start``` which will open a browser window with a QR code to scan. Run the instance in Tunnel Mode to play with others
6. Sign up to create an account and play

---

## Technologies
Pocket Instructors was built using -
- React
- React-Native
- Node.js
- Expo (AV, Camera, Location)
- Socket IO
- Firebase
- Lottie-React-Native
- Express
- Ngrok

---
## Previewing the app


<span align = "left"><img src="./imgs/capture_demo.gif" width="30%"></span>
<span align = "left"><img src="./imgs/capture_demo.gif" width="30%"></span>
<span align = "left"><img src="./imgs/capture_demo.gif" width="30%"></span>
---

## Developers

[Ayman Adil](https://www.linkedin.com/in/aymanadil/), [Andrew Lee](https://www.linkedin.com/in/andrew-lee-67b98746/), [Tajinder Singh](https://www.linkedin.com/in/tajinder-singh-mor/), and [Kavin Thanesjesdapong](https://www.linkedin.com/in/kthanesjesdapong/)


