var player = {};

var GAME = 1;
var FREE = 2;
var FIXED = 3;

var mode = GAME;

function scene_init(scene) {
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 15000 );

    /*
    camera.position.set(0, 200, 10);
    camera.rotation.x = -Math.PI/2;
    camera.rotation.y = 0;
    camera.rotation.z = -Math.PI;
    */

    /*
    camera.position.set(200, 0, 10);
    camera.rotation.x = -2.361533347852155;
    camera.rotation.y = 1.5506897537101544;
    camera.rotation.z = -2.353;
    */

    scene.background = new THREE.Color().setHSL( 0.51, 0.8, 0.08 );
    scene.fog = new THREE.Fog( scene.background, 3500, 15000 );

    scene.setGravity(new THREE.Vector3( 0, 0, -120 ));

    var basic_material = new THREE.MeshBasicMaterial( { color: 0xdeadbe, wireframe: true } );

    var void_material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff,
        shininess: 50
    });
    void_material.transparent = true;
    void_material.opacity = 0.8;

    var ground = new Physijs.BoxMesh(
        new THREE.BoxGeometry(4000, 2000, 1, 10,10,10),
        void_material, //new THREE.MeshBasicMaterial({color: 0xdeadbe, wireframe: true}),
        0 // mass
    );
    scene.add(ground);

    player = player_init(scene, new THREE.Vector3( 0, 0, 20 ));

    var building = new Physijs.BoxMesh(
        new THREE.BoxGeometry(50, 50, 50),
        basic_material,
        1000
    );
    building.position.z = 20;
    building.position.y = 70;
    // car_body.receiveShadow = car_body.castShadow = true;
    scene.add(building);

    var dirLight = new THREE.DirectionalLight( 0xffffff, 0.05 );
    dirLight.position.set( 0, -1, 0 ).normalize();
    scene.add(dirLight);

    dirLight = new THREE.DirectionalLight( 0xffffff, 0.05 );
    dirLight.position.set( 0, 1, 0 ).normalize();
    scene.add( dirLight );

    dirLight = new THREE.DirectionalLight( 0xffffff, 0.05 );
    dirLight.position.set( 1, 1, 0 ).normalize();
    scene.add( dirLight );
    dirLight.color.setHSL( 0.1, 0.7, 0.5 );

    return camera;
}

var view_camera = new THREE.Vector3(0,0,0);

function scene_update(scene, t, delta) {
    if(controls.mode_event) {
        controls.mode_event = null;
        if(mode === GAME) {
            mode = FREE;
            console.log("change mode to free");
            view_camera = player.rotation.clone();
        } else if(mode === FREE) {
            mode = FIXED;
            console.log("change mode to FIXED");
        } else if(mode === FIXED) {
            mode = GAME;
            console.log("change mode to game, sync position");
            view_camera = player.rotation.clone();
        }
    }

    if(mode === GAME || mode === FIXED) {
        player_control({
            player: player,
            controls: controls,
            scene: scene,
            t: t,
            delta: delta
        });
    }

    if(mode === FREE) {
        if(controls.turn === LEFT) {
            console.log("rotate camera");
            view_camera.z += 0.1;
        } else if(controls.turn === RIGHT) {
            console.log("rotate camera");
            view_camera.z -= 0.1;
        } else { // IDLE
            
        }
    }

    if(mode === GAME) {
        camera.position.set(
            player.position.x + 250*Math.cos(player.rotation.z),
            player.position.y + 250*Math.sin(player.rotation.z),
            player.position.z + 60
        );
        camera.rotation.z = 0;
        camera.rotation.x = Math.PI/2;
        camera.rotation.y = Math.PI/2 + player.rotation.z;
    }

    if(mode === FIXED || mode === FREE) {
        camera.position.set(
            player.position.x + 250*Math.cos(view_camera.z),
            player.position.y + 250*Math.sin(view_camera.z),
            player.position.z + 60
        );
        // camera.rotation.z = -view_camera.z + Math.PI/2;
        // camera.rotation.x = -Math.PI/2;
        // camera.rotation.y = -Math.PI;
        camera.rotation.z = 0;
        camera.rotation.x = Math.PI/2;
        camera.rotation.y = Math.PI/2 + view_camera.z;
    }

    player_update({
        player: player,
        scene: scene,
        t: t,
        delta: delta
    });
}
