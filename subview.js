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

var Subview = function(scene, pixelscale, w, h) {
    var camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 100);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 50;
    var rt = new THREE.WebGLRenderTarget(Math.ceil(pixelscale*w), Math.ceil(pixelscale*h),
                                           { minFilter: THREE.LinearFilter,
                                             magFilter: THREE.NearestFilter,
                                             format: THREE.RGBFormat });
    var materialScreen = new THREE.ShaderMaterial( {
        uniforms: { tDiffuse: { type: "t", value: rt} },
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragment_shader_screen' ).textContent,
        depthWrite: false,
        depthTest: false,
    } );
    var m = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(w, h),
        materialScreen
    );
    m.position.z = 3;
    var that = {
        getMesh: function() {
            return m;
        },
        render: function(renderer, x, y) {
            camera.left = x;
            camera.right = x+w;
            camera.top = y;
            camera.bottom = y-h;
            camera.updateProjectionMatrix();
            renderer.render(scene, camera, rt, true);
            m.position.x = x+w/2;
            m.position.y = y-h/2;
        },
    };
    return that;
};
