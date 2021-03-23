const express = require("express");
var app = express();
var cors = require("cors");

const authMiddleware = require('./middlewares/verifyAuthentication');

const authRouter = require("./routes/auth");
const matchRouter = require('./routes/matches');

const mongoose = require('mongoose');
const creds = require('./config/creds');

mongoose.connect(creds.mongodb.atlas_uri, {useNewUrlParser: true, useUnifiedTopology: true})
.then((val) => {
  console.log("Connected successfully...");
})


const port = process.env.PORT || 3000;

app.use(cors({exposedHeaders: "x-auth-token"}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/secured', authMiddleware.verify);

app.use('/api/secured/matches', matchRouter);

app.get("/", (req, res) => {
  console.log(req.headers);
  res.json(req.headers);
});

app.listen(port, () => {
  console.log(`listening to port ${port}...`);
});
