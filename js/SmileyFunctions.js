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
  var gravity = 0.2;
  var bounceFactor = 0.7;
  var makeShapesID;
  var updateID;
  var countDownID;
  var secsLeft = 30;

  init();

  var numShapes;
  var shapes;
  var dragIndex;
  var mouseX;
  var mouseY;
  var dragHoldX;
  var dragHoldY;
  var curShape;
  var caughtNumber = 0;

  function init() {
    numShapes = 1;
    shapes = [];
    resizeCanvas();

    makeShape(defX, defY, defRadius);

    drawScreen();

    theCanvas.addEventListener("mousedown", mouseDownListener, false);
  }

  function makeShape(in_x, in_y, in_rad) {
    tempShape = {x: in_x, y: in_y, rad: in_rad, bouncing: true, vy: 1, vx: 0, dragging: false, caught: false};
    shapes.push(tempShape);
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
    for (i=numShapes - 1; i > -1; i--) {
      if (hitTest(shapes[i], mouseX, mouseY)) {
		if (shapes[i].caught == false) {
			caughtNumber += 1;
			shapes[i].caught = true;
		}      
        shapes[i].dragging = true;
        shapes[i].bouncing = false;
        curShape = shapes[i];
        
        //We will pay attention to the point on the object where the mouse is "holding" the object:
        if (i > highestIndex) {
          dragHoldX = mouseX - shapes[i].x;
          dragHoldY = mouseY - shapes[i].y;
          highestIndex = i;
          dragIndex = i;
        }
        break;
      }
    }
    

    if (curShape.dragging) {
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
    if (curShape.dragging) {
      curShape.dragging = false;
      curShape.bouncing = true;
      window.removeEventListener("mousemove", mouseMoveListener, false);
    }
  }

  function mouseMoveListener(evt) {
    var posX;
    var posY;
    var shapeRad = curShape.rad;
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

    curShape.x = posX;
    curShape.y = posY;

    drawScreen();
  }

  function hitTest(shape,mx,my) {
    if (shape == null)
      return false;

    var dx;
    var dy;
    dx = mx - shape.x;
    dy = my - shape.y;

    //a "hit" will be registered if the distance away from the center is less than the radius of the circular object
    return (dx*dx + dy*dy < shape.rad*shape.rad);
  }

  function drawSmileys(ctx) {
    for (i=0; i < numShapes; i++) {
      var c = document.getElementById("myCanvas");
      if (ctx == null)
        ctx = c.getContext("2d");
      if (shapes[i] == null)
        return;

      ctx.moveTo(0, 0);
      ctx.beginPath();
      ctx.arc(shapes[i].x, shapes[i].y, shapes[i].rad, 0, 2 * Math.PI);
      if (shapes[i].caught)
        ctx.fillStyle = "#73e600";
      else
        ctx.fillStyle = "#ffe066";
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.moveTo(shapes[i].x - 15, shapes[i].y - 30);
      ctx.lineTo(shapes[i].x - 15, shapes[i].y);
      ctx.moveTo(shapes[i].x + 15, shapes[i].y - 30);
      ctx.lineTo(shapes[i].x + 15, shapes[i].y);
      ctx.stroke();
      ctx.beginPath();

      ctx.arc(shapes[i].x, shapes[i].y, 25, .1 * Math.PI, .9 * Math.PI);
      ctx.stroke();
    }

  }

  function drawScreen() {
    resizeCanvas();
    context.clearRect(0, 0, theCanvas.width, theCanvas.height);
    context.fillStyle = "#00ccff";
    context.fillRect(0,0,theCanvas.width,theCanvas.height);
	writeTime(context, theCanvas, secsLeft);
    writeText(context, theCanvas);
    writeNumber(context, theCanvas, caughtNumber);
    drawSmileys(context);
  }

  function resizeCanvas(){
	  
	if (window.innerWidth < 690)
		theCanvas.width  = window.innerWidth - 30;
	else
		theCanvas.width = 660;
	if (window.innerHeight < 370)
		theCanvas.height = window.innerHeight - 30;
	else
		theCanvas.height = 340;
  }

  function update(shape, index) {
    if (shape == null)
      return;

    if (shape.bouncing == false)
    {
      return;
    }
    
    drawScreen();

    // Now, lets make the ball move by adding the velocity vectors to its position
    shape.y += shape.vy;
    // Ohh! The ball is moving!
    // Lets add some acceleration
    shape.vy += gravity;
    //Perfect! Now, lets make it rebound when it touches the floor
    if(shape.y + shape.rad > theCanvas.height) {
      // First, reposition the ball on top of the floor and then bounce it!
      if (Math.abs(shape.vy) < 8) {
        shape.bouncing = false;
        shapes.splice(index, 1);
        return;
      }
      shape.y = theCanvas.height - shape.rad;
      shape.vy *= -bounceFactor;
      // The bounceFactor variable that we created decides the elasticity or how elastic the collision will be. If it's 1, then the collision will be perfectly elastic. If 0, then it will be inelastic.
    }
  }
  
  function makeMoreShapes() {
    if (shapes.length > 20)
      return;
    rand_x = Math.random() * (theCanvas.width);
    makeShape(rand_x, defY, defRadius);
    numShapes += 1;
  }
  
  function updateShapes() {
    var i;
    for (i = 0; i < numShapes; i++)
    {
      update(shapes[i], i);
    }
  }
  
  function stopApp() {
	  clearInterval(updateID);
	  clearInterval(makeShapesID);
	  clearInterval(countDownID);
	  showEndPage(context, theCanvas, caughtNumber);
  }
  
  function countDown() {
	if (secsLeft == 0)
		stopApp();
	else
		secsLeft--;
  }
  updateID = setInterval(updateShapes, 1000/60);
  makeShapesID = setInterval(makeMoreShapes, 500);
  countDownID = setInterval(countDown, 1000);


}
