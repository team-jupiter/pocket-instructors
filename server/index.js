const path = require('path')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const compression = require('compression')

const PORT = process.env.PORT || 3000
const app = express();
const server = require('http').Server(app);
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
    const err = new Error('Not found')
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


server.listen(3000, () => console.log(`Mixing it up on port ${PORT}`));

// The event will be called when a client is connected.
io.on('connection', (socket) => {
  io.clients((error, clients) => {
    if (error) throw error;
    console.log(clients);
  });

  socket.on('position', (position) => {
    socket.broadcast.emit('otherPositions', position);
  })

  socket.on('disconnect', () => {
  })

});

module.exports = app;
