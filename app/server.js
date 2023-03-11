require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const authRouter = require('./routes/authRoute');


// parse json in request body
app.use(express.json());

// parse form in request body
app.use(express.urlencoded({extended: false}));

// promotes cross origin resource sharing
app.use(cors());

// use middleware for authRequests
app.use('/session', authRouter);

const port = 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
