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


// -----------------------------------------

function ed() {
    var container = document.getElementById("ed");
    var w = container.offsetWidth;
    var h = container.offsetHeight;
    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(0, 2.5*w/h, 1.25, -1.25, 0.1, 100);

    var resizeCanvas = function() {
        var nw = container.offsetWidth;
        var nh = container.offsetHeight;
        renderer.setSize(nw, nh);
        camera.right = 2.5*nw/nh;
        camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resizeCanvas, false);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( container.offsetWidth, container.offsetHeight );
    container.appendChild(renderer.domElement);

    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var material = new THREE.MeshPhongMaterial({color: 0xaaaaaa});
    var sphere = new THREE.Mesh(geometry, material);
    var light = new THREE.DirectionalLight(0xffffff, 0.9);
    var ambient = new THREE.AmbientLight(0x3A3A3A);
    light.position.set(1,1,1);

    scene.add(light);
    scene.add(ambient);
    scene.add(sphere);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 50;

    var lastUpdate = null;
    var ed_render = function(currTime) {
        requestAnimationFrame(ed_render);
        lastUpdate = lastUpdate || currTime - 1000/60;
        var delta = Math.min(100, currTime - lastUpdate);
        lastUpdate = currTime;
        renderer.render(scene, camera);
    };
    ed_render();
}

con();
ed();
