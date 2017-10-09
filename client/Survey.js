import React, { Component } from 'react';

class Survey extends Component {
  constructor() {
    super();
    this.state = {

    }
  }


  render() {
    return (
      <div className="survey">
        <form>
          <p>Do you like surveys?</p>
          <input type='select'>
            <select>Yes</select>
            <select>No</select>
          </input>
          <input type='submit' label='Submit' />
        </form>
      </div>
    );
  }
}

export default Survey;
