

function writeText(context, canvas) {
  context.font = "30px Comic Sans MS";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.fillText("Catch the smileys before they disappear!", canvas.width/2, canvas.height/2);
}

function writeNumber(context, canvas, number) {
  context.font = "30px Comic Sans MS";
  context.fillStyle = "purple";
  context.textAlign = "right";
  context.fillText(number, canvas.width - 40, 30);
}


