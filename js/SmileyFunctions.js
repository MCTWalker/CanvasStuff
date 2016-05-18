var canvas = {};
canvas.width = 200;
canvas.height = 100;
var defRadius = 40;
var defY = 50;
var defX = 95;

window.addEventListener("load", windowLoadHandler, false);
var Debugger = function() { };
Debugger.log = function(message) {
  try {
    console.log(message);
  }
  catch (exception) {
    return;
  }
}

function windowLoadHandler() {
  canvasApp();
}

function canvasSupport() {
  return Modernizr.canvas;
}

function canvasApp() {
  if (!canvasSupport()) {
    return;
  }

  var theCanvas = document.getElementById("myCanvas");
  var context = theCanvas.getContext("2d");

  init();

  var numShapes;
  var shape;
  var dragIndex;
  var dragging;
  var mouseX;
  var mouseY;
  var dragHoldX;
  var dragHoldY;

  function init() {
    numShapes = 10;

    makeShapes();

    drawScreen();

    theCanvas.addEventListener("mousedown", mouseDownListener, false);
  }

  function makeShapes() {
    tempShape = {x: defX, y: defY, rad: defRadius};
    shape = tempShape;
  }

  function mouseDownListener(evt) {
    var i;
    //We are going to pay attention to the layering order of the objects so that if a mouse down occurs over more than object,
    //only the topmost one will be dragged.
    var highestIndex = -1;

    //getting mouse position correctly, being mindful of resizing that may have occured in the browser:
    var bRect = theCanvas.getBoundingClientRect();
    mouseX = (evt.clientX - bRect.left)*(theCanvas.width/bRect.width);
    mouseY = (evt.clientY - bRect.top)*(theCanvas.height/bRect.height);

    //find which shape was clicked
      if	(hitTest(shape, mouseX, mouseY)) {
        dragging = true;
          //We will pay attention to the point on the object where the mouse is "holding" the object:
          dragHoldX = mouseX - shape.x;
          dragHoldY = mouseY - shape.y;
          highestIndex = i;
          dragIndex = i;
    }

    if (dragging) {
      window.addEventListener("mousemove", mouseMoveListener, false);
    }
    theCanvas.removeEventListener("mousedown", mouseDownListener, false);
    window.addEventListener("mouseup", mouseUpListener, false);

    //code below prevents the mouse down from having an effect on the main browser window:
    if (evt.preventDefault) {
      evt.preventDefault();
    } //standard
    else if (evt.returnValue) {
      evt.returnValue = false;
    } //older IE
    return false;
  }

  function mouseUpListener(evt) {
    theCanvas.addEventListener("mousedown", mouseDownListener, false);
    window.removeEventListener("mouseup", mouseUpListener, false);
    if (dragging) {
      dragging = false;
      window.removeEventListener("mousemove", mouseMoveListener, false);
    }
  }

  function mouseMoveListener(evt) {
    var posX;
    var posY;
    var shapeRad = shape.rad;
    var minX = shapeRad;
    var maxX = theCanvas.width - shapeRad;
    var minY = shapeRad;
    var maxY = theCanvas.height - shapeRad;
    //getting mouse position correctly
    var bRect = theCanvas.getBoundingClientRect();
    mouseX = (evt.clientX - bRect.left)*(theCanvas.width/bRect.width);
    mouseY = (evt.clientY - bRect.top)*(theCanvas.height/bRect.height);

    //clamp x and y positions to prevent object from dragging outside of canvas
    posX = mouseX - dragHoldX;
    posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
    posY = mouseY - dragHoldY;
    posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);

    shape.x = posX;
    shape.y = posY;

    drawScreen();
  }

  function hitTest(shape,mx,my) {

    var dx;
    var dy;
    dx = mx - shape.x;
    dy = my - shape.y;

    //a "hit" will be registered if the distance away from the center is less than the radius of the circular object
    return (dx*dx + dy*dy < shape.rad*shape.rad);
  }

  function drawSmiley(ctx) {
    var c = document.getElementById("myCanvas");
    if (ctx == null)
      ctx = c.getContext("2d");
    ctx.clearRect(0, 0, theCanvas.width, theCanvas.height)
    ctx.moveTo(0,0);
    ctx.beginPath();
    ctx.arc(shape.x,shape.y,shape.rad,0,2*Math.PI);
    ctx.fillStyle = "#ffe066";
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.moveTo(shape.x - 15, shape.y - 30);
    ctx.lineTo(shape.x - 15, shape.y);
    ctx.moveTo(shape.x + 15,shape.y - 30);
    ctx.lineTo(shape.x + 15,shape.y);
    ctx.stroke();
    ctx.beginPath();

    ctx.arc(shape.x,shape.y,25,.1*Math.PI,.9*Math.PI)
    ctx.stroke();

  }

  function drawScreen() {
    //bg
    //context.fillRect(0,0,theCanvas.width,theCanvas.height);
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSmiley(context);
  }

}

///function bounce() {
  //var c = document.getElementById("myCanvas");
  //var ctx = c.getContext("2d");
  //ctx.clearRect(0, 0, canvas.width, canvas.height);
  //ctx.translate(50, 0);
 // drawSmiley(ctx);
//}

