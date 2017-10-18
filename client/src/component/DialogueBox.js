import React, { Component } from 'react';

class DialogueBox extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
    }
    this.errorOrSubmit = this.errorOrSubmit.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(e) {
    let input = e.target.value;
    this.setState({
      input: input,
      error: false,
    });
  }

  errorOrSubmit() {
    if (this.props.mode !== 'Print' && this.state.input === '') {
      this.setState({
        error: true,
      })
    } else {
      this.props.getInput(this.state.input);
    }
  }

  render() {
    let text = {
      'Print': {header: 'Your photo is printing!', button: 'Okay'},
      'Email': {header: 'Please enter an email address', button: 'Submit!'},
      'Text': {header: 'Please enter a phone number', button: 'Submit!'},
      'Facebook': {header: 'Enter your information to continue', button: 'Okay'},
      'Twitter': {header: 'Enter your information to continue', button: 'Okay'},
    }[this.props.mode];
    let errorMsg = this.state.error 
      ? {
        'Email': 'Please enter an email address',
        'Text': 'Please enter a phone number',
        'Facebook': 'Enter your information to continue',
        'Twitter': 'Enter your information to continue',
      }[this.props.mode]
      : ''
    return (
      <div id='disclaimer-div' style={{position: 'absolute', left: '50%'}}>
        <div id='disclaimer' style={{position: 'relative', left: '-50%',}}> {/*ctn1*/}
          <div id='dialogue-box' className='pop-up'>
            <h1>{text.header}</h1>
            {this.props.mode !== 'Print' 
            && <input type='text' onChange={(e) => {this.handleInput(e)}} value={this.props.inputText}/>}
            <p style={{color: 'white'}}>{errorMsg}</p>
            <button className='btn' onClick={this.errorOrSubmit}>{text.button}</button>
          </div>
        </div>
      </div>
    );
  }
}

export default DialogueBox;
