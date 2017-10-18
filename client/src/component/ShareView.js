import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ShareButtons from './ShareButtons';
import DialogueBox from './DialogueBox';
import Keyboard from './Keyboard';

class ShareView extends Component {
  constructor() {
    super();
    this.state = {
      sessionInfo: null,
      dialogueBox: false,
      keyboardShowing: false,
      inputText: '',
    }
    this.dialogueSet = this.dialogueSet.bind(this);
    this.getInput = this.getInput.bind(this);
    this.submitData = this.submitData.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  componentDidMount() {
    this.setState({
      sessionInfo: this.props.sessionInfo,
    }, () => console.log(this.state.sessionInfo))
  }

  dialogueSet(share) {
    this.setState({
      dialogueBox: share,
      keyboardShowing: (share !== 'Print') && true, 
    })
    if (share === 'Print') {
      console.log(this.state.sessionInfo)
      let newPrint = this.state.sessionInfo.printCount + 1;
      let session = {...this.state.sessionInfo, PrintCount: newPrint}
      this.setState({
        sessionInfo: session
      }, () => {console.log(this.state.sessionInfo)})
    }
  }

  handleInput(key) {
    this.setState(prevState => { 
      return {
        inputText: prevState.inputText.concat(key),
      }
    })
  }
  
  getInput(input) {
    let session = this.state.sessionInfo;
    switch (this.state.dialogueBox) {
      case 'Email':   // remember, you're going to want to make an array for multiple emails
        session = {...this.state.sessionInfo, senderEmail: input}
        break;
      case 'Text':     // see above ^^
      session = {...this.state.sessionInfo, phoneNumber: input}
        break;
      case 'Facebook': 
        session = {...this.state.sessionInfo, postToFacebookFanPage: true}
        break;
      case 'Twitter': 
        session = {...this.state.sessionInfo, postToTwitter: true}
        break;
      }
      this.setState({
        sessionInfo: session,
        dialogueBox: false,
        keyboardShowing: false,
        inputText: '',
      })
    }
    
  submitData() {
    let fd = new FormData();
    let file = this.props.photo;
    let sessionInfo = this.state.sessionInfo;
    fd.append('file', file);
    fd.append('sessionInfo', JSON.stringify(sessionInfo));
    fd.append('type', this.props.photoType)
    fetch('/session', {
      method: 'POST',
      body: fd,
    })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((json) => {
      if (json.message === 'success!') {
        this.props.changeMainStatus('Welcome');
      }
    })
  }

  render() {
    let keyboard = this.state.keyboardShowing 
      && <Keyboard 
        key={'keyboard'}
        handleInput={this.handleInput}
      />;
    let dialogue = this.state.dialogueBox 
    && <DialogueBox 
        mode={this.state.dialogueBox}
        inputText={this.state.inputText} 
        getInput={this.getInput}
      />
    return (
      <div id='share-view'>
        <div id='share-box' className='flex-column' style={{alignItems: 'center' }}>
          <div className='x-box' onClick={this.submitData}>X</div>
          <div id='picture-frame'>
            <img src={this.props.photo} />
          </div>
          <ShareButtons 
          dialogueSet={this.dialogueSet}
          settings={this.props.settings}
          />
          </div>
          <ReactCSSTransitionGroup 
            transitionName='dialogue' 
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnter={true}
            transitionEnterTimeout={500} 
            transitionLeave={true}
            transitionLeaveTimeout={500}>
              {dialogue}
            </ReactCSSTransitionGroup>
            <ReactCSSTransitionGroup 
                transitionName='keyboard' 
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnter={true}
                transitionEnterTimeout={500} 
                transitionLeave={true}
                transitionLeaveTimeout={500}>
                  {keyboard}
              </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default ShareView;
