const path = require('path')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const compression = require('compression')

const PORT = process.env.PORT || 3000
const app = express();
const server = require('https').Server(app);
const io = require('socket.io')(server);

// if (process.env.NODE_ENV !== 'production') require('../secrets')

// logging middleware
app.use(morgan('dev'))

// body parsing middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// compression middleware
app.use(compression())


app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not founddd')
    err.status = 404
    next(err)
  } else {
    next()
  }
})

// error handling endware
app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})


server.listen(19002, () => console.log(`Mixing it up on port ${PORT}`));

// The event will be called when a client is connected.
io.on('connection', function(socket) {

  console.log('Client connected.');

  // Disconnect listener
  socket.on('disconnect', function() {
      console.log('Client disconnected.');
  });
});



io.on('connection', (socket) => {
  io.clients((error, clients) => {
    if (error) throw error;
    console.log('Clients--->',clients);
  });

  socket.on('position', (position) => {
    console.log('POSITION BEING CAUGHT----->',position)
    socket.broadcast.emit('otherPositions', position);
  })

  socket.on('disconnect', () => {
  })

});

module.exports = app;
