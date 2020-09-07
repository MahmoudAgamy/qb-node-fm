const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const QuickBooks = require('node-quickbooks');
const Tokens = require('csrf');
const csrf = new Tokens();
const request = require('request');

const db = require('./config/dbConnect.js');
const txn = require('./models/Txn');
const Txn = require('./models/Txn');

const app = express();
const PORT = 9000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser('mahmoud'));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'agamy'
}));

function generateAntiForgery(session) {
  session.secret = csrf.secretSync();
  return csrf.create(session.secret);
};

//****************** Intuit ******************//
QuickBooks.setOauthVersion('2.0');
var consumerKey = 'AB9kBnH5IJQ75VNzQCPBU1n3H1J4cQTcVMN2qlVDpUfD8pOTmn';
var consumerSecret = 'aU9SLBl39Lf1CKU4jMULD6PKHSV1NsweTutPI0ZK';

app.get('/requestToken/:callback', function (req, res) {
  var redirecturl = QuickBooks.AUTHORIZATION_URL +
    '?client_id=' + consumerKey +
    '&redirect_uri=' + encodeURIComponent('http://localhost:' + PORT + `/${req.params.callback}/`) + //Make sure this path matches entry in application dashboard
    '&scope=com.intuit.quickbooks.accounting' +
    '&response_type=code' +
    '&state=' + generateAntiForgery(req.session);
  console.log("redirecturl: ", redirecturl)
  res.redirect(redirecturl);
});


//****************** Routes ******************//
app.use('/txn', require('./routes/txns'))

//****************** CALLBACK ******************//
//****************** CALLBACK ******************//
//****************** CALLBACK ******************//
app.use('/callback', (req, res) => {
  var auth = (new Buffer(consumerKey + ':' + consumerSecret).toString('base64'));
  console.log("Bufferrrrrrrrr: ", auth.length) //=> 124
  var postBody = {
    url: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + auth,
    },
    form: {
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: 'http://localhost:' + PORT + '/callback/' //Make sure this path matches entry in application dashboard
    }
  };
  
  //****************** CALLBACK ******************//
   request.post(postBody, function (e, r, data) {
    var accessToken = JSON.parse(r.body);
    var qbo = new QuickBooks(consumerKey,
      consumerSecret,
      accessToken.access_token, /* oAuth access token */
      false, /* no token secret for oAuth 2.0 */
      req.query.realmId,
      true, /* use a sandbox account */
      true, /* turn debugging on */
      4, /* minor version */
      '2.0', /* oauth version */
      accessToken.refresh_token
    );
    // const latestpaymentID = txn.
    // const latestpaymentID = txn.
    // const latestpaymentID = txn.
    var pmts = qbo.findPayments({
      limit: 3
      }, async function (err, res){
        if (JSON.stringify(!err)) {
          const payments = await res.QueryResponse.Payment;
          console.log("MAPPPPPPPPPP1: ", payments)
          let mapped = payments.map(pmt => {
            let {
              CustomerRef: {
                value: qbCustomerRef
              },
              TotalAmt: totalAmount,
              Id: qbId,
              MetaData: {
                CreateTime: qbCreateTime
              },
            } = pmt;
            return {
              qbId,
              totalAmount,
              qbCustomerRef,
              qbCreateTime
            }
          })
          console.log("MAPPPPPPPPPP: ", mapped);
          await Txn.bulkCreate(mapped)
        }else{
          // console.log("TTTTTTTTTTHHHHHHHHHHHHHEEERRRRRRRR: ", JSON.stringify(err.Fault.Error[0].Message))
        }
      }
    )
    // const latestpaymentID = txn.
    // const latestpaymentID = txn.
    // const latestpaymentID = txn.
  //   qbo.findBillPayments({Id:20}, (err, obj) => {
  //     console.log(err)
  //   })
  })
  // bulkCreate(my_object_array, {updateOnDuplicate: true})
  res.send( payments )

  // console.log("PaymentZ: ", paymetZ)
  // res.send(payments)
})
//****************** CALLBACK ******************//
//****************** CALLBACK ******************//
//****************** CALLBACK ******************//

app.use('/payment', (req, res) => {
 res.send("Welcome to Payments")
})
app.use('/fm/payment', async (req, res) => {
 let payment = await Txn.findAll({
   where: {
     qbCustomerRef: 60
   }
  });
  res.send(payment)
})


//****************** Database / SERVER ******************//
db.sync({
 force: true
})
  .then(() => console.log("Connected to qbfm-Velect-db"))
  .then(() => app.listen(PORT))
  .catch(err => console.log(err))