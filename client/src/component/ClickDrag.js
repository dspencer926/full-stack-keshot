import React, { Component } from 'react';
import images from './LoadImages';
// import image2 from '../sunglasses.png'
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
      digitalPropNames: [],
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
    fetch('/digitalprops/file_names', {
      method: 'GET',
    }).then(res => {
      console.log(res);
      return res.json();
    }).then(json => {
      this.setState({ digitalPropNames: json.files})
    });

    // let newImage = images.mustache;
    // console.log(newImage.width);
    // console.log(newImage.naturalWidth);
    // this.setState({
    //   images: newImage,
    // })
    this.canv = document.getElementById('canv');
    let ctx = this.canv.getContext('2d');
    this.original = new Image(720, 720);
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
      console.log('instance', instance)
      if (this.withinBox(x, y, instance)) 
        { if (instance.zIndex > zIndex) imageName = instance.name }
    }
    return imageName;
  }

  withinBox(xp, yp, instance) { 
    console.log(instance)      // tests if user clicked within item box
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

  handleMouseDown(e, type = 'click') {
    let x = type === 'touch' ? e.touches[0].clientX - this.canv.offsetLeft : e.clientX - this.canv.offsetLeft;
    let y = type === 'touch' ? e.touches[0].clientY - this.canv.offsetTop : e.clientY - this.canv.offsetTop;
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

  handleMouseMove(e, type = 'click') {
    let mouseDownCoords = this.state.mouseDownCoords;
    let canv = document.getElementById('canv');
    let ctx = canv.getContext('2d');
    let offsetX = type === 'touch' ? e.touches[0].clientX - canv.offsetLeft : e.clientX - canv.offsetLeft;
    let offsetY = type === 'touch' ? e.touches[0].clientY - canv.offsetTop : e.clientY - canv.offsetTop;
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
    }, () => console.log(this.state.images))
    let ctx = canv.getContext('2d');
    newPic = await newPic.generate();
    ctx.drawImage(this.original, 0, 0);
    ctx.drawImage(newPic, 0, 0);
  }

  finalizePic() {
    if (this.state.currentlyActive) {
      this.state.images[this.state.currentlyActive].deselect();
      this.refresh();
    }
    let editCanv = document.getElementById('edit-canv')
    let editCtx = editCanv.getContext('2d');
    editCtx.drawImage(this.canv, 0, 0);
    editCtx.drawImage(this.props.overlay, 0, 0);
    let file = editCanv.toDataURL('image/jpg');
    // get gif from multiple images w/ digital props
    // also get thumbnail
    this.props.getFiles(file, undefined, 'Share');
  }


  render() {
    return (
      <div className='click-drag'
      style={{margin: 'auto'}}
      // onMouseMove={(e)=>{console.log(e.clientX, e.clientY)}}
      >
        <canvas 
          id='canv' 
          width='720'
          height='720' 
          onMouseDown={(e) => this.handleMouseDown(e)}
          onMouseUp={this.handleMouseUp}
          onMouseMove={(e) => this.handleMouseMove(e)} 
          onTouchStart={(e) => this.handleMouseDown(e, 'touch')}
          onTouchEnd={this.handleMouseUp}
          onTouchMove={(e) => this.handleMouseMove(e, 'touch')} 
        />
        <canvas
          id='edit-canv'
          width='720'
          height='720'
          style={{display: 'none'}}
        />
        <Buttons 
          finalizePic={this.finalizePic}
          btnStatus={'digitalProps'}
        />
        <div id='digital-props'>
          {this.state.digitalPropNames.map(img => {
            return (
              <img 
                src={`/digitalprops/${img}`} 
                id={img}
                key={img}
                onClick={(e) => {this.addPic(e)}}
              />
            )
          })}
        </div>
        {/*<img id='pic2' height='350' width='350' src={image2} onClick={(e) => this.addPic(e)} />*/}
      </div>
    );
  }
}

export default ClickDrag;
