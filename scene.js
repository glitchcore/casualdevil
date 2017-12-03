var box_0;
var custom_object;

var player = {};

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
        new THREE.MeshBasicMaterial({color: 0xdeadbe, wireframe: true}),
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

function scene_update(scene, t, delta) {
    player_update({
        player: player,
        controls: controls,
        scene: scene,
        t: t,
        delta: delta
    });

    camera.position.set(
        player.position.x + 250*Math.cos(player.rotation.z),
        player.position.y + 250*Math.sin(player.rotation.z),
        player.position.z + 60
    );
    camera.rotation.x = -Math.PI/2;
    camera.rotation.y = -player.rotation.z + Math.PI/2;
    camera.rotation.z = -Math.PI;   
}
