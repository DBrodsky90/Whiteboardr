var $canvas      = $('#canvas');
var $colorPicker = $('#bottom');
var ctx          = $('#canvas')[0].getContext("2d");
var lineWidth    = 3;
var currentColor = 'black';
var isDrawing    = false;
resizeCanvas();


// FUNCTIONS

function resizeCanvas() {
	$canvas.attr('width', $canvas.width());	
	$canvas.attr('height', $canvas.height());	
}


function draw(x, y, color, lineWidth) {	
	var color = color || 'black';
	ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(lastX, lastY);
  ctx.closePath();
  ctx.lineWidth = lineWidth;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = color;
  ctx.stroke();
  lastX = x, lastY = y;
};

function addDrawing(coords) {
	console.log(coords, lastX, lastY);
	ctx.beginPath();
	ctx.moveTo(coords.x, coords.y);
	ctx.lineTo(lastX, lastY);
	ctx.closePath();
	ctx.lineWidth = coords.lineWidth;
	ctx.lineJoin = 'round';
	ctx.strokeStyle = coords.color;
	ctx.stroke();
	lastX = coords.x, lastY = coords.y;
};

function setLastCoords(coords) {
	lastX = coords.lastX, lastY = coords.lastY;
}
 
function clearCanvas() {
	ctx.clearRect(0, 0, $canvas.width(), $canvas.height());
};


// EVENTS

$(window).resize(resizeCanvas);

socket.on('add drawing', addDrawing);

socket.on('set last coords', setLastCoords);

$canvas.on('mousedown', function(event) {
	isDrawing = true;
	var x = event.offsetX;
	var y = event.offsetY;
	lastX = x, lastY = y;
	socket.emit('send last coords', {lastX: lastX, lastY: lastY});
});

$canvas.on('mousemove', function(event) {
	var x = event.offsetX;
	var y = event.offsetY;
	if(isDrawing) {
		draw(x, y, currentColor, lineWidth);
		socket.emit('drawing', {x: x, y: y, color: currentColor, lineWidth: lineWidth});
	}
});

$canvas.on('mouseup', function(event) {
	isDrawing = false;
});

$canvas.on('mouseleave', function(event) {
	isDrawing = false;
});
