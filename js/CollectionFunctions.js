

function writeText(context, canvas) {
  context.font = "30px Comic Sans MS";
  context.fillStyle = "white";
  context.textAlign = "center";
  if (canvas.width > 640)
	context.fillText("Catch the smileys before they disappear!", canvas.width/2, canvas.height/2);
  else {
	context.fillText("Catch the smileys before", canvas.width/2, canvas.height/2 - 10);
	context.fillText("they disappear!", canvas.width/2, canvas.height/2 + 30);
  }
}

function writeNumber(context, canvas, number) {
  context.font = "30px Comic Sans MS";
  context.fillStyle = "purple";
  context.textAlign = "right";
  context.fillText(number, canvas.width - 40, 30);
}

function writeTime(context, canvas, secsLeft) {
  context.font = "30px Comic Sans MS";
  context.fillStyle = "purple";
  context.textAlign = "left";
  context.fillText("Time Left: " + secsLeft, 40, 30);
}

function showEndPage(context, canvas, numCaught) {
  canvas.style.display = "none";
  var endScreen = document.getElementById('endScreen');
  var resultSpan = document.getElementById('results');
  endScreen.style.display = "block";
  endScreen.style.height = canvas.height + "px";
  endScreen.style.width = canvas.width + "px";
  resultSpan.innerHTML = "You caught " + numCaught + " smileys. ";
  if (numCaught < 30)
	  resultSpan.innerHTML += "Were you asleep?";
  else if (numCaught < 40)
	  resultSpan.innerHTML += "Better hone those reflexes.";
  else
	  resultSpan.innerHTML += "Great Job!";
}

function startOver() {
  document.getElementById('myCanvas').style.display = "block";
  document.getElementById('endScreen').style.display = "none";
  canvasApp();
}

