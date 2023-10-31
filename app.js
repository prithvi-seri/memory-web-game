const express = require('express')
const app = express();

const { AuthorizationCode } = require('simple-oauth2');

app.set('view engine', 'ejs');

//  YOU GET THESE PARAMETERS BY REGISTERING AN APP HERE: https://ion.tjhsst.edu/oauth/applications/    
const ion_client_id = 'JgVS3mgu7Cg75eLd5yX7lQ7qtz1DXNPyMqqJ8EsI';
const ion_client_secret = 'j0RVds2ewgMlSgPbNM4LvVegLBxIOCsprP7nkmRBeDqGK37Os8DOwGY0UBGbeCsRWwb8ZCjws9rQsCqGFHSoY5BVjxpTOYLGqgufR2gI7lPhIAwsba14ZDLS3c6l7Wpd';
// const ion_redirect_uri = 'https://user.tjhsst.edu/pckosek/logger_inner';    //    <<== you choose this one
const ion_redirect_uri = 'http://127.0.0.1/game';    //    <<== you choose this one

(function login() {
  // Here we create an oauth2 variable that we will use to manage out OAUTH operations
  client = new AuthorizationCode({
    client: {
      id: ion_client_id,
      secret: ion_client_secret,
    },
    auth: {
      tokenHost: 'https://ion.tjhsst.edu/oauth/',
      authorizePath: 'https://ion.tjhsst.edu/oauth/authorize',  // This is the link that will be used later on for logging in. This URL takes
      tokenPath: 'https://ion.tjhsst.edu/oauth/token/'          // you to the ION server and asks if you are willing to give read permission to ION.
    }
  });
  
  authorizationUri = client.authorizeURL({
      scope: "read",
      redirect_uri: ion_redirect_uri
  });
})()

async function loggedIn(req, res) {
  retCode = req.query.code

  var options = {
    'code': retCode,
    'redirect_uri': ion_redirect_uri,
    'scope': 'read'
  };

  // needed to be in try/catch
  try {
      var accessToken = await client.getToken(options);      // await serializes asyncronous fcn call
      console.log(accessToken)
      res.locals.token = accessToken.token;
  } 
  catch (error) {
      console.log('Access Token Error', error.message);
      res.sendStatus(502); // error creating token
  }

  res.render('game', {'accessToken' : accessToken.token.access_token})
}

function highscores(req, res) {

  res.render('highscores')
}

app.get('/', function (req, res) {
    res.render('unverified', {'login_link' : authorizationUri})
});

app.get('/game', loggedIn)

app.get('/highscores', highscores)

var listener = app.listen(
  process.env.PORT || 80,
  process.env.HOST || "0.0.0.0",
  function() {
    console.log("Express server started");
});