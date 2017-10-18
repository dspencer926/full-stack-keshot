import images from './LoadImages';

class DraggableImage {
  constructor(name, image) {
    this.name = name;
    this.img = image;
    this.canv = document.createElement('canvas');
    this.canv.width = 720;
    this.canv.height = 720;
    this.ctx = this.canv.getContext('2d');
    this.x = 0;
    this.y = 0;
    this.padding = 50;
    this.width = image.width + (2 * this.padding);
    this.height = image.height  + (2 * this.padding);
    this.imageWidth = image.width;
    this.imageHeight = image.height;
    this.minWidth = 100;
    this.minHeight = 100;
    this.maxWidth = 500;
    this.maxHeight = 500;
    this.right = this.width;
    this.bottom = this.height;
    this.corners = {
      nw: { x: 0, y: 0 },
      ne: { x: this.width, y: 0 },
      se: { x: this.width, y: this.height },
      sw: { x: 0, y: this.height }
    }
    this.center = {
      x: this.width / 2,
      y: this.height / 2,
    }

    this.buttonRadius = 25,
    this.selected = false;
    this.radian = 0;      // actual radian to rotate (delta radian - rotate box radianOffset)
    this.apparentRadian = 0;
    this.radianForButtons = Math.atan2((this.height / 2), (this.width / 2));
    this.radius = Math.sqrt(Math.pow(this.height / 2, 2) + Math.pow(this.width / 2, 2));
    this.radiusForButtons = this.radius - Math.sqrt(2 * Math.pow(this.buttonRadius, 2));
    this.active = true;
    this.constructorResizeBox = {
      radianOffset: -this.radianforButtons,
      top: this.height - 50,
      bottom: this.height,
      left: this.width - 50,
      right: this.width,
      center: {
        x: this.width - this.buttonRadius,
        y: this.height - this.buttonRadius,
      }
    }

    this.constructorRotateBox = {
      radianOffset: this.radianforButtons,
      top: 0,
      bottom: 50,
      left: this.width - 50,
      right: this.width,
      center: {
        x: this.width - this.buttonRadius,
        y: this.buttonRadius,
      }
    }

    this.resizeBoxCoords = this.constructorResizeBox;
    this.rotateBoxCoords = this.constructorRotateBox;
  }

  mode(x, y) {      // where user clicked, to determine action
    if (this.isInCircle(this.resizeBoxCoords.center, x, y)) return 'resize' 
    else if (this.isInCircle(this.rotateBoxCoords.center, x, y)) return 'rotate' 
    else return 'move'
  }

  isInCircle(c, x, y) {     //checks to see if user clicked within circle
    let d = Math.sqrt(Math.pow((x - c.x), 2) + Math.pow((y - c.y), 2))
    console.log(c, x, y, d)
    console.log(this)
    if (d < this.buttonRadius) return true;
    return false;
  }
 
  construct() {       // constructs image with buttons
    let constructionCanv = document.createElement('canvas');
    constructionCanv.height = this.height;
    constructionCanv.width = this.width;
    let ctx = constructionCanv.getContext('2d');
    let image = new Image(this.img.width, this.img.height);
    image.src = this.img.src;
    ctx.drawImage(image, this.padding, this.padding, this.imageWidth, this.imageHeight);
    ctx.fillStyle = "#FF0000";
    let resizeLeft = this.constructorResizeBox.left;
    let resizeTop = this.constructorResizeBox.top;
    let rotateLeft = this.constructorRotateBox.left;
    let rotateTop = this.constructorRotateBox.top;
    if (this.selected) {
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#FFFFFF';
      ctx.moveTo(0, 0);
      ctx.lineTo(0, this.height);
      ctx.lineTo(this.width, this.height);
      ctx.lineTo(this.width, 0);
      ctx.lineTo(0, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(this.constructorRotateBox.center.x, this.constructorRotateBox.center.y, this.buttonRadius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.constructorResizeBox.center.x, this.constructorResizeBox.center.y, this.buttonRadius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = 'red';
      ctx.fill();
      ctx.drawImage(images.resize, resizeLeft + 10, resizeTop + 10, 30, 30);
      ctx.drawImage(images.rotate, rotateLeft + 5, rotateTop + 5, 40, 40);
    }
    return constructionCanv;
  }

  generate() {              // generates canvas to return to client
    this.ctx.clearRect(0, 0, this.canv.width, this.canv.height);
    let imageBox = this.construct();
    if (this.radian) {
      let c = document.createElement('canvas');
      c.width = 720;
      c.height = 720;
      let centerLeft = (c.width - this.width) / 2;
      let centerTop = (c.height - this.height) / 2;
      let ctx = c.getContext('2d');
      ctx.save()
      ctx.translate( (imageBox.width / 2) + this.x, (imageBox.height / 2) + this.y );
      ctx.rotate(-this.radian);
      ctx.drawImage(imageBox, -this.width/2, -this.height/2)
      ctx.restore();
      this.canv = c;
    }
    else {
      this.ctx.drawImage(imageBox, this.x, this.y);
    }
    return this.canv;
  };

  setBoxes() {          // updates measurements
    this.height = this.imageHeight + (2 * this.padding);
    this.width = this.imageWidth + (2 * this.padding);
    if (this.height < this.minHeight) this.height = this.minHeight;            
    if (this.width < this.minWidth) this.width = this.minWidth;
    if (this.height > this.maxHeight) this.height = this.maxHeight;
    if (this.width > this.maxWidth) this.width = this.maxWidth;

    this.bottom = this.y + this.height;
    this.right = this.x + this.width;

    this.center = {
      x: (this.width / 2) + this.x,
      y: (this.height / 2) + this.y,
    }
 
    this.radius = Math.sqrt(Math.pow(this.height / 2, 2) + Math.pow(this.width / 2, 2));
    this.radianForButtons = Math.atan2((this.height / 2) , (this.width / 2));
    this.radiusForButtons = this.radius - Math.sqrt(2 * Math.pow(this.buttonRadius, 2));
    
    this.corners = {
      nw: {
        x: this.center.x + (this.radius * Math.cos(this.radian + Math.PI - this.radianForButtons)),
        y: this.center.y - (this.radius * Math.sin(this.radian + Math.PI - this.radianForButtons)),
      },
      ne: {
        x: this.center.x + (this.radius * Math.cos(this.radian + this.radianForButtons)),
        y: this.center.y - (this.radius * Math.sin(this.radian + this.radianForButtons)),
      },
      se: {
        x: this.center.x + (this.radius * Math.cos(this.radian - this.radianForButtons)),
        y: this.center.y - (this.radius * Math.sin(this.radian - this.radianForButtons)),
      },
      sw: {
        x: this.center.x + (this.radius * Math.cos(this.radian - Math.PI + this.radianForButtons)),
        y: this.center.y - (this.radius * Math.sin(this.radian - Math.PI + this.radianForButtons)),
      },
    }

    this.constructorResizeBox = {
      ...this.constructorResizeBox,
      top: this.height - 50,
      bottom: this.height,
      left: this.width - 50,
      right: this.width,
      center: {
        x: this.width - this.buttonRadius,
        y: this.height - this.buttonRadius,
      },
    };

    this.constructorRotateBox = {
      ...this.constructorRotateBox,
      bottom: this.height,
      left: this.width - 50,
      right: this.width,
      center: {
        x: this.width - this.buttonRadius,
        y: this.buttonRadius,
      },
    };

    this.resizeBoxCoords = {
      center: {
        x: this.center.x + (this.radiusForButtons * Math.cos(this.radian - this.radianForButtons)),
        y: this.center.y - (this.radiusForButtons * Math.sin(this.radian - this.radianForButtons)),
      }
    };

    this.rotateBoxCoords = {
      center: {
        x: this.center.x + (this.radiusForButtons * Math.cos(this.radian + this.radianForButtons)),
        y: this.center.y - (this.radiusForButtons * Math.sin(this.radian + this.radianForButtons)),
      }
    }
  }

  location() {
    console.log(this)
  };

  move(x, y) {
    this.x += x;
    this.y += y;
    this.setBoxes();
    this.generate();
  };

  resize(x, y) {
    if (this.canResize(x, y)) {
      this.imageWidth += x;
      this.imageHeight += y;
      this.setBoxes();
      this.generate();
    }
  };

  canResize(x, y) {           // test if too big or too small to resize
    if ( (this.width >= this.maxWidth && x > 0 ) 
      || (this.height >= this.maxHeight && y > 0 ) 
      || (this.width <= this.minWidth && x < 0 ) 
      || (this.height <= this.minHeight && y < 0 ) 
    ) return false;
    return true;
  };

  rotate(x, y) {
    this.radian = Math.atan2((this.center.y - y), (x - this.center.x)) - this.radianForButtons;
    this.apparentRadian = this.radian + this.radianForButtons;
    this.setBoxes();
    this.generate();
  };

  select() {
    this.selected = true;
    this.setBoxes();
    this.generate();
  }

  deselect() {
    this.selected = false;
    this.setBoxes();
    this.generate();
  }

}

export default DraggableImage;
