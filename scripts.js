var circle = document.body.querySelector('#con .circle');
var width = circle.offsetWidth;  // In pixels
var height = circle.offsetHeight;  // In pixels
var radius = 40;  // In vh

var colors = [
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

var imgs = [
  'images/circle.png',
  'images/radial.png',
  'images/stripes.png',
  'images/dots.png',
  'images/target.png'
];

var numTriangles = 200;
var triangles = [];
var rotations = [];
var xs = [];
var ys = [];
var imageData;

// Use an image to sample, check if the location is non-black.
function checkPixel(top, left) {
  var index = 4*(Math.floor(left)*width + Math.floor(top));
  return imageData[index];
}

// Update the transform property of the ith triangle.
function updateTransform(i) {
  if (rotations[i] == undefined) rotations[i] = 0;
  if (xs[i] == undefined) xs[i] = 0;
  if (ys[i] == undefined) ys[i] = 0;

  triangles[i].style.transform = 'translate(' + xs[i] + ', ' + ys[i] + ') ' +
                                 'rotate(' + rotations[i] + 'deg)';
}

// Create all triangle divs.
function createTriangles() {
  var triangle;
  for (var i = 0; i < numTriangles; i++) {
    triangle = document.createElement('div');
    triangle.classList.add('triangle');
    circle.appendChild(triangle);

    triangles[i] = triangle;
  }
}

// Position all triangles outside the viewport.
function initTriangles() {
  var angle = 0;
  var distance = 0;
  var x = 0;
  var y = 0;

  for (var i = 0; i < numTriangles; i++) {
    angle = Math.random() * Math.PI + Math.PI/2;
    distance = Math.max(window.outerWidth, window.outerHeight) *
                 (Math.random() + 1) + 100;

    xs[i] = Math.cos(angle)*distance - distance + 'px';
    ys[i] = Math.sin(angle)*distance + 'px';

    updateTransform(i);
  }
}

// Rotate all triangles by an additional amount.
function rotateTriangles() {
  var rotation = 0;
  for (var i = 0; i < numTriangles; i++) {
    rotation = (Math.random() - 0.5) * 360 * 3;

    if (rotations[i] == undefined) rotations[i] = rotation;
    else rotations[i] += rotation;

    updateTransform(i);
  }
}

// Color all triangles.
// Warning: this causes repaint and is inefficient.
function colorTriangles() {
  var color = 'white';
  for (var i = 0; i < numTriangles; i++) {
    color = colors[Math.floor(Math.random() * colors.length)];

    triangles[i].style.borderBottomColor = color;
  }
}

// Fade all triangles in, out, then back again.
function winkTriangles() {
  // Fade in
  var opacity = 0;
  for (var i = 0; i < numTriangles; i++) {
    opacity = Math.random() * 0.5 + 0.5;

    triangles[i].style.opacity = opacity;
  }

  setTimeout(function() {
    // Fade out
    var opacity2 = 1;
    for (var i = 0; i < numTriangles; i++) {
      opacity2 = Math.random() * 0.25;

      triangles[i].style.opacity = opacity2;
    }

    setTimeout(function() {
      // Reset
      for (var i = 0; i < numTriangles; i++) {
        triangles[i].style.opacity = '';
      }
    }, 1000);

  }, 500);
}

// Shrink, then grow, then reset all triangles.
function pulseTriangles() {
  // Shrink
  var scale = 1;
  for (var i = 0; i < numTriangles; i++) {
    scale = Math.random() * 0.75;

    triangles[i].style.transform += 'scale(' + scale + ')';
  }

  setTimeout(function() {
    // Grow
    var scale2 = 1;
    for (var i = 0; i < numTriangles; i++) {
      scale2 = Math.random() * 2 + 1;

      updateTransform(i);
      triangles[i].style.transform += 'scale(' + scale2 + ')';
    }

    setTimeout(function() {
      // Reset
      for (var i = 0; i < numTriangles; i++) {
        updateTransform(i);
      }
    }, 1000);

  }, 500);
}

// Position all triangles in the selected pattern.
function positionTriangles() {
  var top = 0;
  var left = 0;

  for (var i = 0; i < numTriangles; i++) {
    for (var j = 0; j < 100; j++) {
      top = Math.random() * radius * 2;  // In vh
      left = Math.random() * radius;  // In vh

      if (checkPixel(left * width/radius, top * height/radius/2)) break;
    }
    top -= 2; // Shift by amount to give center of triangle
    left -= 2; // Shift by amount to give center of triangle

    xs[i] = left + 'vh';
    ys[i] = top + 'vh';

    updateTransform(i);
  }
}

function setTriangles() {
  rotateTriangles();
  positionTriangles();
}

function createCanvas() {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  var img = new Image();
  img.onload = function() {
    canvas.getContext('2d').drawImage(img, 0, 0, width, height);
    imageData = canvas.getContext('2d').getImageData(0, 0, width, height).data;

    setTriangles();
  };
  img.src = imgs[Math.floor(Math.random() * imgs.length)];
}

function refreshCanvas() {
  var refresh = Math.random() * 5;
  if (refresh < 1) {
    rotateTriangles();
    setTimeout(rotateTriangles, 1000);
  }
  else if (refresh < 2) {
    positionTriangles();
    setTimeout(positionTriangles, 1000);
  }
  else if (refresh < 3) {
    initTriangles();
    setTimeout(createCanvas, 1000);
  }
  else if (refresh < 4) {
    winkTriangles();
  }
  else if (refresh < 5) {
    pulseTriangles();
  }

  setTimeout(refreshCanvas, 10000);
}

function con() {
  createTriangles();
  initTriangles();
  colorTriangles();

  createCanvas();

  setTimeout(refreshCanvas, 10000);
}



// -----------------------------------------
var SharedScene = function() {
    var objs_ = {};
    var uniqueobjs_ = {};
    var scenes_ = [];

    var that = {
        addScene: function() {
            var scene = new THREE.Scene();
            for (var o in objs_) {
                scene.add(objs_[o]());
            }
            scenes_.push(scene);
        },
        addShared: function(name, o) {
            objs_[name] = o;
            for (var i = 0; i < scenes_.length; i++) {
                scenes_[i].add(o());
            }
        },
        addUnique: function(name, o) {
            uniqueobjs_[name] = o;
            for (var i = 0; i < scenes_.length; i++) {
                scenes_[i].add(o[i]);
            }
        },
        addSingle: function(i, o) {
            scenes_[i].add(o);
        },
        getScene: function(i) {
            return scenes_[i];
        },
        each: function(name, f) {
            for (var i = 0; i < scenes_.length; i++) {
                if (name in uniqueobjs_) {
                    f(uniqueobjs_[name][i]);
                }
            }
        }
    };
    return that;
};
function rotate(mesh, axis, amount) {
    var m = new THREE.Matrix4();
    axis.normalize();
    m.makeRotationAxis(axis, amount);
    mesh.matrix.multiply(m);
    mesh.rotation.setFromRotationMatrix(mesh.matrix);
}

function ed() {
    var container = document.getElementById("ed");
    var w = container.offsetWidth;
    var h = container.offsetHeight;
    var vh = 0.45;
    var vw = 0.6;
    var ps = h/2.5;
    var camera = new THREE.OrthographicCamera(0, 2.5*w/h, 1.25, -1.25, 0.1, 100);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 50;

    var scene = SharedScene();

    var geometry = new THREE.SphereGeometry(1, 24, 24);

    var tex = THREE.ImageUtils.loadTexture("images/earthmapbw1k.jpg");
    tex.minFilter = THREE.LinearFilter;
    var bumptex = THREE.ImageUtils.loadTexture("images/earthbump1k.jpg");
    bumptex.minFilter = THREE.LinearFilter;
    var moonbumptex = THREE.ImageUtils.loadTexture("images/moonbumpmap.jpg");
    moonbumptex.minFilter = THREE.LinearFilter;
    var spectex = THREE.ImageUtils.loadTexture("images/earthspec1k.jpg");
    spectex.minFilter = THREE.LinearFilter;
    var geoms = [
        geometry,
        geometry,
        geometry,
        new THREE.SphereGeometry(1, 12, 8),
        geometry,
    ];
    var mats = [
        new THREE.MeshPhongMaterial({color: 0xaaaaaa}),
        new THREE.MeshBasicMaterial({wireframe: true}),
        new THREE.MeshPhongMaterial({
            color: 0x999999,
            bumpMap: moonbumptex,
            bumpScale: 0.04,
        }),
        new THREE.MeshPhongMaterial({color: 0xcccccc, shading: THREE.FlatShading}),
        new THREE.MeshPhongMaterial({
            map: tex,
            bumpMap: bumptex,
            bumpScale: 0.02,
            specularMap: spectex,
            specular: 0x333333
        }),
    ];
    var spheres = [];
    var states = [];
    for (var i = 0; i < mats.length; i++) {
        var pt = new THREE.Vector2(0,0);
        do {
            pt.x = 2*Math.random()-1;
            pt.y = 2*Math.random()-1;
        } while (pt.lengthSq() > 1 || pt.x < vw/2);

        var theta = Math.random()*2*Math.PI;
        var speed = 1.5*(Math.random()+1);
        var v = new THREE.Vector2(speed*Math.sin(theta), speed*Math.cos(theta));
        states.push({p: pt, v: v});
    }
    scene.addShared("dirlight1", function() {
        var light = new THREE.DirectionalLight(0xffffff, 0.9);
        light.position.set(1,1,1);
        return light;
    });
    scene.addShared("dirlight2", function() {
        var light = new THREE.DirectionalLight(0x555555, 0.9);
        light.position.set(-1,-1,-1);
        return light;
    });
    scene.addShared("ambientlight", function() {
        return new THREE.AmbientLight(0x3A3A3A);
    });
    for (var i = 0; i < mats.length; i++) {
        scene.addScene();
        spheres.push(new THREE.Mesh(geoms[i], mats[i]));
    }
    scene.addUnique("sphere", spheres);
    rotate(spheres[spheres.length-1], new THREE.Vector3(0,1,0), 5.1);
    rotate(spheres[spheres.length-1], new THREE.Vector3(0,0,1), -0.3);

    var mainrenderer = new THREE.WebGLRenderer();
    mainrenderer.setPixelRatio( window.devicePixelRatio );
    mainrenderer.setSize(w, h);
    mainrenderer.autoClear = false;

    container.appendChild(mainrenderer.domElement);

    var resizeCanvas = function() {
        var nw = container.offsetWidth;
        var nh = container.offsetHeight;
        mainrenderer.setSize(nw, nh);
        camera.right = 2.5*nw/nh;
        camera.updateProjectionMatrix();
        ps = nh/2.5;
    }
    window.addEventListener('resize', resizeCanvas, false);

    var lastUpdate = null;
    var simulatePosition = function(state, dt) {
        var p = state.p;
        var v = state.v;

        p = p.addScaledVector(v,dt);
        if (p.lengthSq() > 1.0) {
            var n = new THREE.Vector2(-p.x, -p.y);
            n.normalize();
            var s = n.dot(v);
            v = v.addScaledVector(n, -2*s);
        }
        if (p.x < vw/2) v.x = -v.x;
        return {p: p, v: v};
    };
    var ed_render = function(currTime) {
        requestAnimationFrame(ed_render);
        lastUpdate = lastUpdate || currTime - 1000/60;
        var delta = Math.min(100, currTime - lastUpdate);
        lastUpdate = currTime;
        mainrenderer.clear();
        /*
        scene.each("sphere", function(s) {
            var m = new THREE.Matrix4();
            var axis = new THREE.Vector3(0.05,1,0);
            axis.normalize();
            m.makeRotationAxis(axis, 0.0003);
            s.matrix.multiply(m);
            s.rotation.setFromRotationMatrix(s.matrix);
        });
        */
        mainrenderer.render(scene.getScene(0), camera);
        mainrenderer.enableScissorTest(true);
        mainrenderer.setClearColor(0x1a1a1a);
        for (var i = 1; i < states.length; i++) {
            states[i] = simulatePosition(states[i], 0.001);
            mainrenderer.setScissor(
                    ps*(states[i].p.x-vw/2),
                    ps*(states[i].p.y+1.25 - vh/2),
                    ps*vw, ps*vh);
            mainrenderer.clear();
            mainrenderer.render(scene.getScene(i), camera);
        }
        mainrenderer.enableScissorTest(false);
        mainrenderer.setClearColor(0x000000);
    };
    ed_render();
}


con();
ed();
