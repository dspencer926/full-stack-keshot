import React, { Component } from 'react';

class Buttons extends Component {
  constructor() {
    super();
    this.state = {
      mode: null,
      clickDisabled: false,
    }
  }

  

  render() {
    let btnDisplay;
    switch (this.props.btnStatus) {
      case 'noBtns':
        btnDisplay = null;
        break;
      case 'letsGo': 
        btnDisplay = 
        <button id='go-btn' className='btn' onClick={() => {
          this.props.changeViewStatus(
            this.props.disclaimer
              ? 'disclaimer'
              : 'options'
          )}}> Let's Go! </button>
        break;
      case 'takePic':
        btnDisplay = 
        <button id='go-btn' className='btn' onClick={this.props.takePic}> Take Picture </button>
        break;
      case 'digitalProps': 
        btnDisplay = 
        <button id='next-btn' className='btn' onClick={this.props.finalizePic}> Next -> </button>
        break;
      case 'confirm':
       btnDisplay = 
       <div id='two-btns'>
          <button id='retake-btn' className='btn' onClick={this.props.retake}> Retake </button>
          <button id='continue-btn' className='btn' onClick={this.props.confirmPic}> Continue -></button>
        </div>
        break;
    }

    return (
      <div id='button-container'>
        {btnDisplay}
      </div>
    );
  }
}

export default Buttons;
