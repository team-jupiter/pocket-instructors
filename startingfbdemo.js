import {
  AppBar,
  Box,
  Button,
  Grid,
  Paper,
  Toolbar,
  Typography,
} from '@material-ui/core';
import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import firebase from './firebase';
import { AuthContext } from './auth/Auth';
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();
mic.continuous = true;
mic.interimResults = true;
mic.lang = 'en-US';
const useStyles = makeStyles((theme) => ({
  root: {
      flexGrow: 1,
  },
  paper: {
      height: 340,
      width: 300,
      padding: theme.spacing(4),
  },
  control: {},
}));
function Ideas() {
  const classes = useStyles();
  const [isListening, setIsListening] = React.useState(false);
  const [idea, setIdea] = React.useState(null);
  const [savedIdeas, setSavedIdeas] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [userData, setUserData] = React.useState({});
  const user = useContext(AuthContext);
  console.log(user.currentUser.email);
  const email = user.currentUser.email;
  const ref = firebase.firestore().collection('users');
  function getUserData() {
      setLoading(true);
      ref.where('email', '==', email).onSnapshot((querySnapshot) => {
          const items = [];
          querySnapshot.forEach((doc) => {
              items.push(doc.data());
          });
          setUserData(items[0]);
          setLoading(false);
      });
  }
  useEffect(() => {
      getUserData();
  }, []);
  useEffect(() => {
      setSavedIdeas(userData.ideas);
  }, [userData]);
  useEffect(() => {
      handleListen();
  }, [isListening]);
  const handleListen = () => {
      if (isListening) {
          mic.start();
          mic.onend = () => {
              console.log('continue..');
              mic.start();
          };
      } else {
          mic.stop();
          mic.onend = () => {
              console.log('Stopped Mic on Click');
          };
      }
      mic.onstart = () => {
          console.log('Mics on');
      };
      mic.onresult = (event) => {
          const transcript = Array.from(event.results)
              .map((result) => result[0])
              .map((result) => result.transcript)
              .join('');
          console.log(transcript);
          setIdea(transcript);
          mic.onerror = (event) => {
              console.log(event.error);
          };
      };
  };
  const handleSaveIdea = () => {
      setSavedIdeas([...savedIdeas, idea]);
      user.currentUser.ideas = savedIdeas;
      setIdea('');
      ref.doc('user1')
          .update({
              ideas: [...savedIdeas, idea],
          })
          .catch((err) => {
              console.log(err);
          });
      console.log(userData);
  };
  const handleDeleteIdea = (idea) => {
      const newIdeas = savedIdeas.filter((i) => i !== idea);
      setSavedIdeas(newIdeas);
      ref.doc('user1')
          .update({
              ideas: newIdeas,
          })
          .catch((err) => {
              console.log(err);
          });
      console.log(newIdeas);
  };
  if (loading) {
      return 'Loading...';
  }
  const gapi = window.gapi;
  const CLIENT_ID =
      '524344921328-7q1bc9bk8tttdlinagqmradd3u8m7tj8.apps.googleusercontent.com';
  const API_KEY = 'AIzaSyCsUSShWEUthqkflvmrNolNyfZMapahKc8';
  const DISCOVERY_DOCS = [
      'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
  ];
  const SCOPES = 'https://www.googleapis.com/auth/calendar.events';
  const handlePursue = (title) => {
      gapi.load('client:auth2', () => {
          console.log('loaded client');
          gapi.client.init({
              apiKey: API_KEY,
              clientId: CLIENT_ID,
              discoveryDocs: DISCOVERY_DOCS,
              scope: SCOPES,
          });
          gapi.client.load('calendar', 'v3', () => console.log('done!'));
          gapi.auth2
              .getAuthInstance()
              .signIn()
              .then(() => {
                  var event = {
                      summary: title,
                      location: '800 Howard St., San Francisco, CA 94103',
                      description:
                          "A chance to hear more about Google's developer products.",
                      start: {
                          dateTime: '2015-05-28T09:00:00-07:00',
                          timeZone: 'America/Los_Angeles',
                      },
                      end: {
                          dateTime: '2015-05-28T17:00:00-07:00',
                          timeZone: 'America/Los_Angeles',
                      },
                      recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
                      attendees: [
                          { email: 'lpage@example.com' },
                          { email: 'sbrin@example.com' },
                      ],
                      reminders: {
                          useDefault: false,
                          overrides: [
                              { method: 'email', minutes: 24 * 60 },
                              { method: 'popup', minutes: 10 },
                          ],
                      },
                  };
                  const request = gapi.client.calendar.events.insert({
                      calendarId: 'primary',
                      resource: event,
                  });
                  request.execute((event) => {
                      window.open(event.htmlLink);
                  });
              });
      });
  };
  return (
      <>
          <div className="container">
              <div className="box" align="center">
                  <Typography variant="h5">
                      <Box p={2}>Record Idea</Box>
                  </Typography>
                  <Button
                      variant="contained"
                      onClick={() =>
                          setIsListening((prevState) => !prevState)
                      }
                  >
                      {isListening ? 'Stop' : 'Record'}
                  </Button>
                  <Box p={2}>
                      <Button
                          variant="contained"
                          onClick={handleSaveIdea}
                          disabled={!idea}
                      >
                          Save Idea
                      </Button>
                  </Box>
                  <Typography>
                      <Box p={2}>{idea}</Box>
                  </Typography>
              </div>
              <div className="box">
                  {savedIdeas.length ? (
                      <Grid container className={classes.root} spacing={3}>
                          {savedIdeas.map((n) => (
                              <Grid item>
                                  <Paper
                                      elevation={3}
                                      className={classes.paper}
                                  >
                                      <Typography variant="h3">
                                          {n.split(' ').slice(0, 3).join(' ')}
                                      </Typography>
                                      <Box p={2}>
                                          <Typography key={n}>{n}</Typography>
                                      </Box>
                                      <Button
                                          variant="contained"
                                          onClick={() => handleDeleteIdea(n)}
                                      >
                                          {' '}
                                          Delete{' '}
                                      </Button>
                                      <Button
                                          variant="contained"
                                          onClick={() =>
                                              handlePursue(
                                                  n
                                                      .split(' ')
                                                      .slice(0, 3)
                                                      .join(' ')
                                              )
                                          }
                                      >
                                          {' '}
                                          Pursue{' '}
                                      </Button>
                                  </Paper>
                              </Grid>
                          ))}
                      </Grid>
                  ) : (
                      'no idea'
                  )}
              </div>
          </div>
      </>
  );
}
export default Ideas;
