const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
const multer = require('multer');
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

// app.get('/info', function (req, res) {
//   res.send
// })

// ^^^ configure so that frontend makes request to get config and overlay with logo
//     from specific folder

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.post('/session', upload.single('file'), (req, res) => {
  const file = req.body.file;
  const picType = req.body.type;
  const sessionInfo = req.body.sessionInfo;
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
      fs.writeFile(`./uploads/${rando}_Info.txt`, sessionInfo, function(err) {
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