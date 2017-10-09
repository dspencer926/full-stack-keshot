<canvas id="myCanvas1" width="250" height="250" style="border:1px solid #d3d3d3;">
Your browser does not support the HTML5 canvas tag.</canvas>
<canvas id="myCanvas2" width="250" height="250" style="border:1px solid #d3d3d3;">
Your browser does not support the HTML5 canvas tag.</canvas>
<canvas id="myCanvas3" width="150" height="150" style="border:1px solid #d3d3d3;">
Your browser does not support the HTML5 canvas tag.</canvas>


let sWidth = 150;
let sHeight = 150;

var c = document.getElementById("myCanvas1");
var ctx = c.getContext("2d");
var c2 = document.getElementById("myCanvas2");
var ctx2 = c2.getContext("2d");
var c3 = document.getElementById("myCanvas3");
var ctx3 = c3.getContext("2d");

let left = (c3.width - sWidth) / 2;
let hat = (c3.height - sHeight) / 2;
let centerLeft = (c2.width - sWidth) / 2;
let centerTop = (c2.height - sHeight) / 2;
console.log( centerLeft, centerTop )


ctx.fillStyle = 'blue';
ctx.fillRect(0, 0, 250, 250);

ctx3.fillStyle = 'green';
ctx3.fillRect(left, hat, sWidth, sHeight);

ctx2.save()
//ctx2.translate( c2.width/2 - 30, c2.height/2 - 30);
ctx2.translate( centerLeft, centerTop );
ctx2.rotate(50 * Math.PI / 180);
ctx2.drawImage(c3, -sWidth/2,-sHeight/2)
ctx2.restore();

ctx.fillStyle = 'red'
ctx.fillRect(200, 200, 25, 25)

ctx.save();
ctx.translate(-centerLeft, -centerTop);
ctx.drawImage(c2, 0, 0)
ctx.restore();

ctx.fillRect(0, 0, 25, 25);