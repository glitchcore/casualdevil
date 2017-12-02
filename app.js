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

    // camera
    
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 15000 );
    camera.position.set( 190, 0, 8 );
    // camera.lookAt(scene.position);
    // camera.position.x = 100;
    // camera.rotation.x = Math.PI / 4;
    // camera.rotation.y = Math.PI / 2;
    // camera.rotation.z = 0;//Math.PI / 4;

    camera.rotation.x = -2.361533347852155;
    camera.rotation.y = 1.4806897537101544;
    camera.rotation.z = -2.364403904012276;
    

    controls = new THREE.FlyControls( camera );
    
    controls.movementSpeed = 1000;
    controls.domElement = container;
    controls.rollSpeed = Math.PI / 5;
    controls.autoForward = false;
    controls.dragToLook = true;
    

    // scene

    scene_init(scene);

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

    controls.update(delta);
    renderer.render(scene, camera);

    // console.log("camera:", camera.rotation);
}