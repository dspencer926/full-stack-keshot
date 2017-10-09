import React, { Component } from 'react';

class Disclaimer extends Component {
  constructor() {
    super();
    this.state = {
    }
  }


  render() { 
    return (
      <div id='disclaimer-div' style={{position: 'absolute', left: '50%'}}>
        <div id='disclaimer' style={{position: 'relative', left: '-50%',}}> {/*ctn1*/}
          <p>We're going to photoshop a penis in your mouth.  That cool? </p>
          <div id='disclaimer-button-div'style={{flexDirection: 'row', display: 'flex'}}>
            <button className='btn' onClick={() => {this.props.disclaimerSet(true)}}>Yes</button>
            <button className='btn' onClick={() => {this.props.disclaimerSet(false)}}>No</button>      
          </div> 
        </div> 
      </div>
    );
  }
}

export default Disclaimer;
