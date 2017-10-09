import React, { Component } from 'react';

class ShareButtons extends Component {
  constructor() {
    super();
    this.state = {
      buttonArray: [],          //  array of buttons to be displayed.
    }
  }

  componentDidMount() {
    let buttons = [];
    let settings = this.props.settings;
    if (settings.email) {
      buttons.push('Email');
    }
    if (settings.text) {
      buttons.push('Text');
    }
    if (settings.print) {
      buttons.push('Print');
    }
    if (settings.facebook) {
      buttons.push('Facebook');
    }
    if (settings.twitter) {
      buttons.push('Twitter');
    }
    this.setState({
      buttonArray: buttons,
    })
  }
  

  render() {
    return (
      <div id='share-buttons' className='flex-row'>
        {this.state.buttonArray.map((val, key) => {
          return <button key={key} id={`${val}-button`} className='share-button' onClick={()=>{this.props.dialogueSet(val)}}>{val}</button>
        })}
      </div>
    );
  }
}

export default ShareButtons;
