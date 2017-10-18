import React, { Component } from 'react';

class Keyboard extends Component {
  constructor() {
    super();
    this.state = {
      keys: [
        ['1', '2', '3', '4', '5', '6', '7', '8','9', '0'],
        ['q', 'w', 'e', 'r', 't','y', 'u', 'i','o', 'p'],
        ['a', 's', 'd', 'f', 'g','h', 'j', 'k','l'],
        ['^', 'z', 'x', 'c', 'v', 'b','n', 'm', '.', '^'],
        ['space']
      ],
      upperCase: false,
    }
  }

  clickKey(e) {
    let key = e.target.innerHTML;
    if (key === 'space') {
      key = ' ';
    }
    if (key === '^') {
      if (!this.state.upperCase) {
        this.setState({
          keys: [
            ['1', '2', '3', '4', '5', '6', '7', '8','9', '0'],
            ['Q', 'W', 'E', 'R', 'T','Y', 'U', 'I','O', 'P'],
            ['A', 'S', 'D', 'F', 'G','H', 'J', 'K','L'],
            ['^', 'Z', 'X', 'C', 'V', 'B','N', 'M', '.', '^'],
            ['space']
          ],
          upperCase: true,
        })
      } else if (this.state.upperCase) {
        this.setState({
          keys: [
            ['1', '2', '3', '4', '5', '6', '7', '8','9', '0'],
            ['q', 'w', 'e', 'r', 't','y', 'u', 'i','o', 'p'],
            ['a', 's', 'd', 'f', 'g','h', 'j', 'k','l'],
            ['^', 'z', 'x', 'c', 'v', 'b','n', 'm', '.', '^'],
            ['space']
          ],
          upperCase: false,
        })
      }
    }
    this.props.handleInput(key);
  }

  render() {
    return (
      <div className='keyboard-div'>
        <div className='flex-column keyboard'>
          {this.state.keys.map((val1, key1) => {
            return <div id={`row${key1 + 1}`} key={key1} className='flex-row keyboard-row'>
                {val1.map((val2, key2) => {
                  let style;
                  if (val2 === '^') {
                    style = this.state.upperCase && 'uppercase-shift'
                  }
                return <div id={`${val2}`} className={`key ${style}`} key={key2} onClick={(e)=>{this.clickKey(e)}}>{val2}</div>
                })}
            </div>
          })}
        </div>
      </div>
    );
  }
}

export default Keyboard;
