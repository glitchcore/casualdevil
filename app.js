var camera, scene, renderer;
var controls;

var clock = new THREE.Clock();

Physijs.scripts.worker = 'lib/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

init();

function init() {

    var container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene = new Physijs.Scene({ reportsize: 10, fixedTimeStep: 1 / 30 });

    scene.addEventListener(
        'update',
        function() {
            scene.simulate(undefined, 2);
        }
    );

    // controls = new THREE.FlyControls( camera );
    
    // controls.movementSpeed = 1000;
    // controls.domElement = container;
    // controls.rollSpeed = Math.PI / 5;
    // controls.autoForward = false;
    // controls.dragToLook = true;
    

    // scene
    camera = scene_init(scene);

    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMapSoft = true;

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    window.addEventListener( 'resize', onWindowResize, false );

    scene.simulate();
    requestAnimationFrame(animate);
}

function onWindowResize( event ) {
    renderer.setSize( window.innerWidth, window.innerHeight );

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

var start = performance.now();
function animate(t_now) {
    requestAnimationFrame(animate);
    var delta = clock.getDelta();
    var t = (t_now - start)/1000;

    scene_update(scene, t, delta);

    // controls.update(delta);
    renderer.render(scene, camera);
    
    // console.log("camera:", camera.rotation);
}