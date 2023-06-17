const express = require('express');

const app = express();
const cors = require('cors');
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const routes = require('./routes');


app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

// allows communication from client
app.use(cors({ credentials: true, origin: true }));
app.use(express.static(path.join(__dirname, './client/build')));
app.use(cookieParser());
app.use(session({
  secret: 'secret',
  resave: false,
  cookie: { httpOnly: false, secure: false },
  saveUninitialized: true,
}));

app.put('/signup', (req, res) => {
  // upon joining the game, the current user's information is kept track of within a session
  req.session.room_id = req.body.room_id
  req.session.username = req.body.username
  req.session.web_socket = req.body.web_socket
  console.log('This is updated session')
  res.status(200).json({ message: 'Successfully Signed Up'});
})

app.get('/user', (req, res) => {
  console.log('In get request')
  res.status(200).json({username: req.session.username, room_id: req.session.room_id})
})

app.get(`/problems/:problemId/default-code`, (req, res) => {
  try {
    const result = routes.getDefaultCodeMap(req.params.problemId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err });
  }
})

// request used to post results of grading
app.post('/grader', (req, res) => {

})

// wildcard endpoint for react app
app.get('*', (req, resp) => {
  resp.sendFile(path.join(__dirname, './client/build/index.html'));
});

const port = process.env.PORT || 8081;

// enables server on port 8081
app.listen(port, async () => {
  console.log('Server listening on PORT 8081');
});
