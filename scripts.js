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
