import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import sessionInfo from '../sessionInfo.json';
import Screen from './Screen';
import Buttons from './Buttons';
import Disclaimer from './Disclaimer';
import Survey from './Survey';
import gifShot from 'gifshot';
// const env = require('dotenv');  why is this here??

class MainView extends Component {
  constructor() {
    super();
    this.state = {
      media: null,                                  //  is mediaDevices available? T/F
      header: 'Welcome to Keshot',                  //  message at top of screen
      status: 'welcome',                            //  status of page (what screen to show)
      btnStatus: 'letsGo',                          //  button status (what buttons to show)
      buttonsDisabled: false,                       //  buttons disabled T/F
      photoType: null,                              //  'jpg' / 'gif'
      showOptions: null,                            //  photoType option box display T/F
      currentGif: null,                             //  GIF result 
      sessionInfo: null,                            //  session info imported from JSON file
      showDisclaimer: null,                         //  disclaimer display? T/F
      showSurvey: null,                             //  survey display? T/F
    };  
    this.changeViewStatus = this.changeViewStatus.bind(this);
    this.updateSessionInfo = this.updateSessionInfo.bind(this);
    this.takePic = this.takePic.bind(this);
    this.changeButtonStatus = this.changeButtonStatus.bind(this);
    this.retake = this.retake.bind(this);
    this.confirmPic = this.confirmPic.bind(this);
    this.disclaimerSet = this.disclaimerSet.bind(this);
  }

  componentDidMount() {
    console.log('mainScreen')
    this.updateSessionInfo();                        
    if(navigator.mediaDevices) {              //  check userMedia and initialize video
      console.log('getUserMedia supported');
      this.setState({media: true})
    } else {
      console.log('getUserMedia not supported');
      this.setState({media: false})
    }
  }

  updateSessionInfo() {
    let newInfo = sessionInfo;
    newInfo.sessionDate = new Date(),
    newInfo.sessionCode = 'sessionCode';
    newInfo.locationCode = this.props.settings.locationCode;
    this.setState({
      sessionInfo: newInfo,
    })
  }

  disclaimerSet(answer) {
    this.setState({
      showDisclaimer: false,
    }, () => {this.changeViewStatus('options')});
    if (answer === false) {
      this.props.startOver();
    }
  }

  changeViewStatus(status) {                            //  changes state status :
    this.setState({status: status}, () => {             //  'options': display options box
      switch (this.state.status) {    
        case 'disclaimer':
          this.setState({
            showDisclaimer: true,
          });
          break;                        
        case 'options': 
          if (this.props.settings.gif) {
            this.setState({
              header: 'Select Type',
              showOptions: true,
            })
          } else {
            this.changeViewStatus('snap');
          }
          break;
        case 'snap':                                          
          this.setState({               
            header: 'Take Your Picture!',     
            showOptions: false,
            btnStatus: 'takePic',
          });
          break;
        case 'confirm':
          this.setState({

          });
          break;
      } 
    });
  }

  // isGif(gif) {
  //   this.setState({
  //     isGif: type,
  //   })
  // }

  takePic() {
    this.setState({
      btnStatus: 'noBtns',
    }, this.screen.takePic)
  }

  retake() {
    this.screen.retake();
  }

  confirmPic() {
    this.screen.confirmPic();
  }

  changeButtonStatus(status) {
    this.setState({
      btnStatus: status,
    })
  }

  render() {
    let view;
    let btnBox;
    let disclaimer = this.state.showDisclaimer && 
      <Disclaimer key={'disclaimer'} disclaimerSet={this.disclaimerSet}/>

    switch (this.state.media) {
      case null: 
        view = <p> Loading </p>
        break;
      case false:
        view = <p> Problem loading camera </p>
        break;
      case true: 
        view = 
          <Screen 
            ref={instance => this.screen = instance}
            showOptions={this.state.showOptions}
            changeViewStatus={this.changeViewStatus}
            changeButtonStatus={this.changeButtonStatus}
            getFiles={this.props.getFiles}
            settings={this.props.settings}
          />
        btnBox = !(this.state.btnStatus === 'noBtns') &&
          <Buttons 
            disclaimer={this.props.settings.disclaimer}
            btnStatus={this.state.btnStatus}
            takePic={this.takePic}
            changeViewStatus={this.changeViewStatus}
            retake={this.retake}
            confirmPic={this.confirmPic}
            toDownload={this.state.toDownload}
            fileName={this.state.fileName}
          />
      }
    return (
      <div id='welcome' className='flex-col'>
        <h1>{this.state.header}</h1>
        <ReactCSSTransitionGroup 
          transitionName='test' 
          transitionAppear={true}
          transitionAppearTimeout={500}
          transitionEnter={true}
          transitionEnterTimeout={500} 
          transitionLeave={true}
          transitionLeaveTimeout={500}>
            {disclaimer}
        </ReactCSSTransitionGroup>
        {view}
        {btnBox}
      </div>
    );
  }
}

export default MainView;
