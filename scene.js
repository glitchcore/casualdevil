var player = {};

var GAME = 1;
var FREE = 2;
var FIXED = 3;

var mode = GAME;

function scene_init(scene) {
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, AREA_RADIUS);

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
    scene.fog = new THREE.Fog( scene.background, AREA_RADIUS/2, AREA_RADIUS);

    scene.setGravity(new THREE.Vector3( 0, 0, -120 ));

    var basic_material = new THREE.MeshBasicMaterial( { color: 0xdeadbe, wireframe: true } );

    var void_material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff,
        shininess: 50
    });
    void_material.transparent = true;
    void_material.opacity = 0.8;

    add_ground_area(scene, {x:0, y:0}, false);

    player = player_init(scene, new THREE.Vector3( 0, 0, 20 ));

    var enemy_geometry = new THREE.Geometry();

    var ENEMY_SIZE = 8;

    enemy_geometry.vertices.push(
        new THREE.Vector3(-ENEMY_SIZE, -ENEMY_SIZE, -ENEMY_SIZE),
        new THREE.Vector3(-ENEMY_SIZE,  ENEMY_SIZE, -ENEMY_SIZE),
        new THREE.Vector3( ENEMY_SIZE,  ENEMY_SIZE, -ENEMY_SIZE),
        new THREE.Vector3( ENEMY_SIZE, -ENEMY_SIZE, -ENEMY_SIZE),
        new THREE.Vector3(-ENEMY_SIZE, -ENEMY_SIZE,  ENEMY_SIZE),
        new THREE.Vector3( ENEMY_SIZE, -ENEMY_SIZE,  ENEMY_SIZE),
        new THREE.Vector3(-ENEMY_SIZE,  ENEMY_SIZE,  ENEMY_SIZE),
        new THREE.Vector3( ENEMY_SIZE,  ENEMY_SIZE,  ENEMY_SIZE),

        new THREE.Vector3( 0, 0, -3 * ENEMY_SIZE),
        new THREE.Vector3( 0, 0, 3 * ENEMY_SIZE),
        new THREE.Vector3( 0, -3 * ENEMY_SIZE, 0),
        new THREE.Vector3( 0, 3 * ENEMY_SIZE, 0)
    );

    enemy_geometry.faces.push(
        new THREE.Face3(8, 0, 1),
        new THREE.Face3(8, 1, 2),
        new THREE.Face3(8, 2, 3),
        new THREE.Face3(8, 3, 0),

        new THREE.Face3(10, 3, 5),
        new THREE.Face3(10, 4, 5),
        new THREE.Face3(10, 4, 0),
        new THREE.Face3(10, 0, 3),

        new THREE.Face3(9, 6, 5),
        new THREE.Face3(9, 4, 5),
        new THREE.Face3(9, 4, 7),
        new THREE.Face3(9, 7, 6),

        new THREE.Face3(11, 7, 6),
        new THREE.Face3(11, 6, 1),
        new THREE.Face3(11, 1, 2),
        new THREE.Face3(11, 2, 7),

        new THREE.Face3(0, 1, 6),
        new THREE.Face3(0, 6, 4),

        new THREE.Face3(2, 3, 7),
        new THREE.Face3(3, 7, 5),
        // new THREE.Face3(11, 2, 7),
    );

    var enemy = new Physijs.ConcaveMesh(
        enemy_geometry,
        new THREE.MeshPhongMaterial({color: 0xff0000, specular: 0xffffff, shininess: 5}),
        0
    );
    enemy.position.x = 0;
    enemy.position.y = 0;
    enemy.position.z = 60;

    scene.add(enemy);

    /*
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
    */

    return camera;
}

var view_camera = new THREE.Vector3(0,0,0);
var last_area_hash = "";

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

    var area = check_area(scene, player.position.x, player.position.y);
    if(last_area_hash !== area_hash(area)) {
        last_area_hash = area_hash(area);
        console.log("area changed to", last_area_hash);

        
        for(var x = area.x - 1; x <= area.x + 1; x++) {
            for(var y = area.y - 1; y <= area.y + 1; y++) {
                // console.log("add area:", x, y);
                setTimeout(function() {
                    add_ground_area(scene, this, true)
                }.bind({x:x, y:y}), 1)
            }
        }
        
    }
}
