import React, { Component } from 'react';

class OptionBox extends Component {
  constructor() {
    super();
    this.state = {
    }
  }

  render() {
    return (
      <div id='option-box'> 
        <button id='single-option' className='option-btn' onClick={() => {this.props.setMode('jpg')}}> Single Picture </button>
        <button id='gif-option' className='option-btn' onClick={() => {this.props.setMode('gif')}}> GIF </button>
      </div>  
    );
  }
}

export default OptionBox;
