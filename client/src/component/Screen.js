import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import OptionBox from './OptionBox'
import Disclaimer from './Disclaimer';
import GifRow from './GifRow.js';  
import gifShot from 'gifshot';
import settings from '../settings.json';

class Screen extends Component {
  constructor() {
    super();
    this.state = {
      cameraStream: null,                           //  data URL for camera stream
      videoElement: null,                           //  grab video element
      status: 'welcome',                            //  status of page (what screen to show)
      photoType: 'jpg',                             //  'jpg' / 'gif'
      optionBox: null,                              //  photoType option box HTML
      videoDimensions: {},                          //  dimensions to use for canvas
      countDown: false,                             //  counting down to take picture? T/F
      count: null,                                  //  number shown for count
      photoArray: [],                               //  array of photos to make GIF
      gifConfirm: false,                            //  GIF confirm screen T/F 
      currentGif: null,                             //  GIF result 
      loadingGif: false,                            //  T when GIF is loading 
      showMiniPics: false,                          //  Show mini pics while taking GIF T/F
      overlay: false,                               //  T/F overlay
      imageCoords: [0, 0]                           //  coordinates of image
    }
    this.videoInitialize = this.videoInitialize.bind(this);
    this.setMode = this.setMode.bind(this);
    this.takePic = this.takePic.bind(this);
    this.videoToCanvas = this.videoToCanvas.bind(this);
    this.addProp = this.addProp.bind(this);
    var video;
  }

  componentDidMount() {
    this.videoInitialize();
  }
  
  videoInitialize() {                //  connect video element to stream from camera
    let constraints = {video: true};
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      this.setState({
        cameraStream: window.URL.createObjectURL(stream),
      })
      this.video = document.getElementById('video');
      // console.log(this.video.videoWidth, this.video.videoHeight)
      this.setState({videoDimensions: {
        height: this.video.height,
        width: this.video.width,
      }})
      this.video.play();              
    })
  }

  videoToCanvas() {
    let canv = document.getElementById('canv').getContext('2d');
    let v = this.video;
    if (v.paused || v.ended) return false;
    canv.drawImage(v, -150, 0, 1200, 900);
    if (this.state.overlay) {
      let coords = this.state.imageCoords;
      let image = document.getElementById('logo');
      canv.drawImage(image, coords[0], coords[1])
      coords = coords.map((val) => {
        return val + 1
      })
      this.setState({
        imageCoords: coords,
      }, () => console.log(this.state.imageCoords))
    }
    setTimeout(this.videoToCanvas, 20);
  }

  setMode(mode) {                    // set state with photo type ('jpg' or 'gif')
    this.setState({
      photoType: mode,
    }, () => {
      this.props.changeViewStatus('snap');
    })
  }

  takePic() {            
    console.log('takepic')                       
     // router for picture taking (jpg/gif)
    if (this.state.photoType === 'jpg') {
      this.singleShot();
    } else if (this.state.photoType === 'gif') {
      this.gifPic();
    }
}

  singleShot() {                                    // takes single picture
    this.setState({
      countDown: true,
    }, () => {
      let i = 3
      let countInterval = setInterval(()=> {
        this.setState({
          count: i
        }, () => {
            i--;
          })
        if (i < 0) {
          this.setState({
            count: null,
          }, () => {
            clearInterval(countInterval);
            this.video.pause();
            this.setState({
              header: 'Download or Retake!',
              status: 'confirm',
            }, () => {this.props.changeButtonStatus('confirm')});
          });
        }
      }, 1000);
    })
  }

  async gifPic() {                                  // takes gif
    this.setState({
      countDown: true,
      btnStatus: 'noBtns',
      showMiniPics: true,
    })                                                   
    let gifShots = () => {
      return new Promise((resolve) => {
        let i = 3
        let countInterval = setInterval(()=> {
          this.setState({
            count: i
          }, () => {
            i--;
          })
          if (i < 0) {
            this.setState({
              count: null,
            }, () => {
              clearInterval(countInterval);
              let canv = document.getElementById('canv');
              let miniCanv = document.getElementById('mini-canv');
              // let startX = -((this.state.videoDimensions.width - this.state.videoDimensions.height) / 2);
              miniCanv.getContext('2d').drawImage(canv, 0, 0);
              let jpg = canv.toDataURL("image/jpg");
              this.setState((prevState) => {return {
                photoArray: prevState.photoArray.concat(jpg),
              }}, () => {
                console.log(this.state.photoArray);
                let canvases = document.querySelectorAll('.miniPic');
                console.log(canvases)
                let newCanv = canvases[canvases.length-1];
                console.log(newCanv);
                newCanv.getContext('2d').drawImage(canv, 0, 0, newCanv.width, newCanv.height)
              })
              resolve(jpg);
            });
          }
        }, 500);
      })
    }

    let makeGif = () => {
      let gifArray = this.state.photoArray;
      gifShot.createGIF({
        'images': gifArray,
        'interval': 0.3,
        'gifWidth': 900,
        'gifHeight': 900,
      },(obj) => {
        if(!obj.error) {
          this.setState({
            gifConfirm: true,
            header: 'Download or Retake!',
            btnStatus: 'confirm',
            currentGif: obj.image,
            showMiniPics: false
          }, () => {this.props.changeButtonStatus('confirm')});
        }
      });   
    }

    for (let j = 0; j < 6; j++) {
      await gifShots();
    }
    this.video.pause();
    this.setState({
      loadingGif: true,
    })
    setTimeout(makeGif, 500);
  }

  retake() {                              //  retake pic (single or gif)
    this.setState({
      countDown: false,
      gifConfirm: false,
      photoArray: [],
      btnStatus: 'takePic',
      loadingGif: false,
    }, () => {
      this.videoInitialize();
      this.props.changeViewStatus('snap');
    })
  }

  confirmPic() {                        //  send info to App.js component for share screen 
    let canv = document.getElementById('canv');
    let file = (this.state.photoType === 'jpg') ? canv.toDataURL('image/jpg') : this.state.currentGif;
    let type = this.state.photoType;
    let status = this.props.settings.digitalProps ? 'Click' : 'Share';
    // get thumbnail of first shot, also consider click/drag for gifs as well
    this.props.getFiles(file, type, status);
  }

  addProp() {
    this.setState({overlay: true});
  }

  render() {
    let disclaimer = this.props.showDisclaimer && 
    <Disclaimer key={'disclaimer'} disclaimerSet={this.disclaimerSet}/>
    return (
      <div id='screen'>
        <div className='flex-row'>
            <div id='video-or-gif'>
              <ReactCSSTransitionGroup 
              transitionName='dialogue' 
              transitionAppear={true}
              transitionAppearTimeout={500}
              transitionEnter={true}
              transitionEnterTimeout={500} 
              transitionLeave={true}
              transitionLeaveTimeout={500}>
                {disclaimer}
            </ReactCSSTransitionGroup>
              {this.state.gifConfirm 
                ? <div id='gif-result'>
                    <img id='animated-gif' src={this.state.currentGif}></img>
                  </div> 
                : <div id='video-div'>
                    {this.props.showOptions && <OptionBox setMode={this.setMode}/>}
                    {this.state.countDown && <div id='countdown-box'>{this.state.count}</div>}
                    {this.state.loadingGif && <div id='loading-icon'><i className="fa fa-spinner fa-pulse fa-5x" aria-hidden="true"></i></div> }
                    <canvas id='canv' 
                      width={this.state.videoDimensions.height}
                      height={this.state.videoDimensions.height}>
                    </canvas>
                    <video id="video" width="1200" height="900" src={this.state.cameraStream} onPlay={this.videoToCanvas}></video>
                  </div>
              }
                <div>
                  <canvas id='mini-canv' width='300' height='300' style={{display: 'none'}} />
                </div>
            </div>
        </div>
        {this.state.showMiniPics 
        &&  <GifRow
              photoArray={this.state.photoArray}
            />}
      </div>
    );
  }
}

export default Screen;
