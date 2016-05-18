var canvas = {};
canvas.width = 200;
canvas.height = 100;

function bounce() {
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(50, 0);
  drawSmiley(ctx);
}

function drawSmiley(ctx) {
  var c = document.getElementById("myCanvas");
  if (ctx == null)
    ctx = c.getContext("2d");
  ctx.moveTo(0,0);
  ctx.beginPath();
  ctx.arc(95,50,40,0,2*Math.PI);
  ctx.fillStyle = "#ffe066";
  ctx.fill();
  ctx.lineWidth = 5;

  ctx.moveTo(80,20);
  ctx.lineTo(80,50);
  ctx.moveTo(110,20);
  ctx.lineTo(110,50);

  ctx.moveTo(120,56);

  ctx.arc(95,50,25,.1*Math.PI,.9*Math.PI)
  ctx.stroke();

}