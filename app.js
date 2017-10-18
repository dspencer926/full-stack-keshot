const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
const multer = require('multer');
const cors = require('cors');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, 'newPic.jpg')
  }
})
const upload = multer({ 
  dest: storage,
  limits: { fieldSize: 25 * 1024 * 1024 }
})
// const io = require('socket.io').listen(server);
// const ss = require('socket.io-stream');
const fs = require('fs');
// const request = require('request');

// require('dotenv').config()

const PORT = process.env.PORT || 3001;
server.listen(PORT, function() {
  console.log(`listening on port ${PORT}`);
});

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

// app.get('/info', function (req, res) {
//   res.send
// })

// ^^^ configure so that frontend makes request to get config and overlay with logo
//     from specific folder

app.get('/settings', function(req, res) {
  console.log('settings');
  let settings = fs.readFileSync('./activationData/settings.json');
  res.send(settings);
})

app.get('/overlay', function(req, res) {
  console.log('overlay');
  let overlay = fs.readFileSync('./activationData/overlay.png')
  res.send(overlay)
})

app.get('/logo', function(req, res) {
  console.log('logo');
  let logo = fs.readFileSync('./activationData/logo.png')
  res.send(logo)
})

app.get('/digitalprops/:param', function(req, res) {
  if (req.params.param === 'file_names') {
    fs.readdir('./activationData/digitalProps', (err, files) => {
      files = files.filter(name => {
        return name[0] !== '.';
      })
      res.json({files});
    });
  } else {
    fs.readdir('./activationData/digitalProps', (err, files) => {
      let prop = fs.readFileSync(`./activationData/digitalProps/${req.params.param}`)
      res.send(prop);
    })
  }
  // let logo = fs.readFileSync('./activationData/logo.png')
  // res.send(logo)
})

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.post('/session', upload.single('file'), (req, res) => {
  const file = req.body.file;
  const picType = req.body.type;
  const sessionInfo = req.body.sessionInfo;
  console.log(sessionInfo)
  const b64string = file.slice(file.indexOf(','));
  var success = {
    picture: null,
    text: null,
  }
  let buf = Buffer.from(b64string, 'base64');
  let rando = Math.floor(Math.random() * Math.pow(10, 9));
  console.log('file received?');
    fs.writeFile(`./uploads/${rando}_Pic.${picType}`, buf, function(err) {
      if(err) {
        success.picture = false;
        return console.log(err);
      }
      console.log("The picture was saved!");
      success.picture = true;
      let sessionText = 
      `[Session]
SessionDate=${sessionInfo.sessionDate}
SessionCode=${sessionInfo.sessionCode}
LocationCode=${sessionInfo.locationCode}
Lang=${sessionInfo.lang}
PostcardCode=${sessionInfo.postcardCode}
SecurityType=${sessionInfo.securityType}
SessionType=${sessionInfo.sessionType}
Image=${sessionInfo.image}
SenderEmail=${sessionInfo.senderEmail}
SenderPhone=${sessionInfo.senderPhone}
FBCode1=${sessionInfo.fbCode1}
FBMessage1=${sessionInfo.fbMessage1}
TWCode1=${sessionInfo.twCode1}
TWMessage1=${sessionInfo.twMessage1}
TWCommands1=${sessionInfo.twCommands1}
IGHandle1=${sessionInfo.igHandle1}
PostToFacebookFanPage=${sessionInfo.postToFacebookFanPage}
NewGUI2015=${sessionInfo.newGUI2015}
NewSessionType=${sessionInfo.newSessionType}
SendMP4=${sessionInfo.sendMP4}
Orientation=${sessionInfo.orientation}
SMSMessage=${sessionInfo.smsMessage}
Optin=${sessionInfo.optin}
PrintCount=${sessionInfo.printCount}
[Files]
Image=${sessionInfo.PrintCount}
Thumb=${sessionInfo.Thumb}
`
      fs.writeFile(`./uploads/${rando}_Info.txt`, sessionText, function(err) {
        if(err) {
          success.text = false;
          return console.log(err);
        }
        console.log("The text was saved!");
        success.text = true;
        console.log(success);
        if (success.picture && success.text) {
          res.json({message: 'success!'});
        } else if (success.picture === false || success.text === false) {
          res.json({message: 'error :('})
        }
      }); 
    });
});

/* handling 404 */
app.get('*', function(req, res) {
  res.status(404).send({message: 'Oops! Not found.'});
});