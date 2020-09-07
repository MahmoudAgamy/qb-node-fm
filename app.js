var express = require('express');
var db = require('./config/dbConnect.js');
var txn = require('./models/Txn');

const app = express();
const PORT = 9000;



//****************** Routes ******************//
app.use('/txn', require('./routes/txns'))
app.use('/', (req, res) => {
 res.send("Welcome to localhost 9000")
})


//****************** Database / SERVER ******************//
db.sync({
 force: false
})
  .then(() => console.log("Connected to qbfm-Velect-db"))
  .then(() => app.listen(PORT))
  .catch(err => console.log(err))