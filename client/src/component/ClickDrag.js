import React, { Component } from 'react';
import image from '../mustache.png';
import DraggableImage from './DraggableImage';
import Buttons from './Buttons'

class ClickDrag extends Component {
  constructor() {
    super();
    this.state = {
      imageCoords: {x: 0, y: 0},
      mouseDownCoords: {x: null, y: null},
      action: null,             //  move, resize, rotate, or [delete?]
      currentlyActive: null,    //  item to be manipulated
      dragging: false,
      images: {},
      imageCount: 0,
    }
    this.refresh = this.refresh.bind(this);
    // this.addPic = this.addPic.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.finalizePic = this.finalizePic.bind(this);
    let original;
    let canv
  }

  componentDidMount() {
    this.canv = document.getElementById('canv');
    let ctx = this.canv.getContext('2d');
    this.original = new Image();
    this.original.src = this.props.photo;
    this.original.onload = () => {
      ctx.drawImage(this.original, 0, 0);
    }
  }

  refresh() {
    let ctx = this.canv.getContext('2d');
    ctx.drawImage(this.original, 0, 0);
    for (var image in this.state.images) {
      let instance = this.state.images[image]
      ctx.drawImage(instance.canv, 0, 0);
    }
  }

  checkItems(x, y) {             // loops thru all props to see if user clicked on one
    let zIndex = 0;
    let imageName = null;
    for (var image in this.state.images) {
      let instance = this.state.images[image]
      if (this.withinBox(x, y, instance)) 
        { if (instance.zIndex > zIndex) imageName = instance.name }
    }
    return imageName;
  }

  withinBox(xp, yp, instance) {       // tests if user clicked within item box
    let c = instance.corners;
    let one = this.calc(c.nw.x, c.nw.y, c.ne.x, c.ne.y, xp, yp);
    let two = this.calc(c.ne.x, c.ne.y, c.se.x, c.se.y, xp, yp);
    let three = this.calc(c.se.x, c.se.y, c.sw.x, c.sw.y, xp, yp);
    let four = this.calc(c.sw.x, c.sw.y, c.nw.x, c.nw.y, xp, yp);
    if (one && two && three && four) return true;    
    return false;   
  }

  calc(x1, y1, x2, y2, xp, yp) {      // calculation to be used with withinBox
    let A = -(y2 - y1);
    let B = x2 - x1;
    let C = - ((A * x1) + (B * y1));  
    let D = (A * xp) + (B * yp) + C;  
    let result = (D > 0)? true : false;
    return result;
    
  }

  handleMouseDown(e) {
    let x = e.clientX - this.canv.offsetLeft;
    let y = e.clientY - this.canv.offsetTop;
    let imageName = this.checkItems(x, y);
    if (imageName) {
      if (!this.state.images[imageName].selected) {
        this.state.images[imageName].select();
        this.refresh();
      }
      let mode = this.state.images[imageName].mode(x, y);
      console.log(mode);
      let obj = {x: x, y: y}
      this.setState({
        action: mode,
        currentlyActive: imageName,
        mouseDownCoords: obj,
      })
    } else {
      if (this.state.currentlyActive) {
        this.state.images[this.state.currentlyActive].deselect();
        this.refresh();
        this.setState({
          action: null,
          currentlyActive: null,
        })
      }
    }
  }

  handleMouseUp() {
    this.setState({
      action: null,
    });
  }

  handleMouseMove(e) {
    let mouseDownCoords = this.state.mouseDownCoords;
    let canv = document.getElementById('canv');
    let ctx = canv.getContext('2d');
    let offsetX = e.clientX - canv.offsetLeft;
    let offsetY = e.clientY - canv.offsetTop;
    let mouseMovementX = offsetX - mouseDownCoords.x;
    let mouseMovementY = offsetY - mouseDownCoords.y;
    if (this.state.action) {
      let active = this.state.images[this.state.currentlyActive];
      switch (this.state.action) {
        case 'move': {
          active.move(mouseMovementX, mouseMovementY)
          let currentCoords = {x: offsetX, y: offsetY}
          this.setState({
            mouseDownCoords: currentCoords,
          }, () => {this.refresh()})
        }
        break;
        case 'resize': {
          active.resize(mouseMovementX, mouseMovementY) // make function return canvas
          let canv = active.canv;
          let currentCoords = {x: offsetX, y: offsetY}
          this.setState({
            mouseDownCoords: currentCoords,
          }, () => {this.refresh()})
        }
          break;
        case 'rotate': {
          active.rotate(offsetX, offsetY);
          let canv = active.canv;
          let currentCoords = {x: offsetX, y: offsetY}
          this.setState({
            mouseDownCoords: currentCoords,
          }, () => {this.refresh()})
        }
      }
    }
  }

  async addPic(e) {                       // adds new prop when user clicks one
    let zIndex = this.state.imageCount + 1;
    this.setState({
      imageCount: zIndex,
    })
    let name = e.target.id;
    let canv = document.getElementById('canv');
    let newPic = new DraggableImage(name, e.target);
    newPic.location();
    let obj = this.state.images;
    obj[newPic.name] = newPic;
    obj[newPic.name].zIndex = zIndex;
    this.setState({
      images: obj,
    }, () => this.state.images[name].location())
    let ctx = canv.getContext('2d');
    newPic = await newPic.generate();
    console.log(newPic)
    ctx.drawImage(this.original, 0, 0);
    ctx.drawImage(newPic, 0, 0);
  }

  finalizePic() {
    if (this.state.currentlyActive) {
      this.state.images[this.state.currentlyActive].deselect();
      this.refresh();
    }
    let file = this.canv.toDataURL('image/jpg');
    // get gif from multiple images w/ digital props
    // also get thumbnail
    this.props.getFiles(file, undefined, 'Share')
  }


  render() {
    return (
      <div className='click-drag'
      style={{margin: 'auto'}}
      // onMouseMove={(e)=>{console.log(e.clientX, e.clientY)}}
      >
        <canvas 
          id='canv' 
          height='900' 
          width='900'
          onMouseDown={(e) => this.handleMouseDown(e)}
          onMouseUp={this.handleMouseUp}
          onMouseMove={(e) => this.handleMouseMove(e)} />
          <Buttons 
            finalizePic={this.finalizePic}
            btnStatus={'digitalProps'}
          />
        <img id='pic' height='350' width='350' src={image} onClick={(e) => this.addPic(e)} />
      </div>
    );
  }
}

export default ClickDrag;
