var conCircle = document.body.querySelector('#con .circle');
var conColors = [
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#ffff00',
  '#00ffff',
  '#ff00ff',
  '#ff8800',
  '#ff0088',
  '#88ff00',
  '#00ff88',
  '#8800ff',
  '#0088ff'
];

function createTriangle(top, left, rotation, color) {
  var div = document.createElement('div');
  div.classList.add('triangle');
  div.style.borderBottomColor = color;
  div.style.top = top + 'vh';
  div.style.left = left + 'vh';
  div.style.transform = 'rotate(' + rotation + 'deg)';
  conCircle.appendChild(div);
}

function generateTriangles() {
  var top = 0;
  var left = 0;
  var rotation = 0;
  var color = 'white';
  for (var i = 0; i < 200; i++) {
    top = Math.floor(Math.random() * 100) - 10;  // In units of vh
    left = Math.floor(Math.random() * 60) - 10;  // In units of vh
    rotation = Math.floor(Math.random() * 360);
    color = conColors[Math.floor(Math.random() * conColors.length)];

    createTriangle(top, left, rotation, color);
  }
}

function con() {
  generateTriangles();
}

function ed() {
}

con();
ed();
