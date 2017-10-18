import React, { Component } from 'react';
import './App.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
// import settings from './settings.json';
import sessionInfo from './sessionInfo.json';
import MainView from './component/MainView';
import ShareView from './component/ShareView';
import Keyboard from './component/Keyboard';
import ClickDrag from './component/ClickDrag';

class App extends Component {
  constructor() {
    super();
    this.state = {
      status: 'Welcome',
      settings: {},
      sessionInfo: {},
      photo: null,
      photoType: null,
    }
    this.changeMainStatus = this.changeMainStatus.bind(this);
    this.startOver = this.startOver.bind(this);
    this.getFiles = this.getFiles.bind(this);
  }

  componentDidMount() {
    let settings;
    fetch('/settings', {
      method: 'GET',
    }).then(res => {
      return res.json();
    }).then(json => {
      settings = json;
      let overlay = new Image(720, 720);
      overlay.src = '/overlay';
      settings.overlay = overlay;
      this.setState({
        settings,
        sessionInfo,
      })
    })
  }

  startOver() {
    this.forceUpdate();
    this.setState({
      status: 'Reset',
    }, () => {
      this.setState({
        status: 'Welcome'
      })
    })
  }

  changeMainStatus(status) {
    this.setState({status: status});
  }

  getFiles(file, type = this.state.photoType, status) {  
    this.setState({
      photo: file,
      photoType: type,
      status: status, 
    })
  }
  
  submitFiles(file, session) {

  }


  render() {
    let view;
    let logo = <img id='logo' height='400' width='400' src='/logo' />;
    switch (this.state.status) {
      case 'Welcome': 
        view = 
          <MainView
            changeMainStatus={this.changeMainStatus}
            setPhotoURL={this.setPhotoURL}
            settings={this.state.settings}
            startOver={this.startOver}
            getFiles={this.getFiles}
          />
        break;
      case 'Click':
        view = 
          <ClickDrag 
            photo={this.state.photo}
            getFiles={this.getFiles}
            overlay={this.state.settings.overlay}
          />
        break;
      case 'Share':
        view = 
          <ShareView
            settings={this.state.settings} 
            sessionInfo={this.state.sessionInfo}
            photo={this.state.photo}
            submitFiles={this.submitFiles}
            photoType={this.state.photoType}
            changeMainStatus={this.changeMainStatus}
          />
        break;
      }
    return (
      <div className='App'>
        <button id='start-over-btn' className='btn' onClick={this.startOver}> Start Over </button>
        {view}
        {logo}
      </div>
    );
  }
}

export default App;
