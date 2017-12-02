var box_0;
var custom_object;

var player;

function make_player(scene, position) {
    var LEGS_HEIGHT = 20;
    var BODY_HEIGHT = 15;

    box = new Physijs.BoxMesh(
        new THREE.BoxGeometry(10, 10, BODY_HEIGHT),
        new THREE.MeshBasicMaterial({ color: 0xdeadbe, wireframe: true }),
        1000
    );

    box.position.z = LEGS_HEIGHT * 1.5;

    var support_box = new Physijs.BoxMesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshLambertMaterial({color: 0xffffff, transparent: false, opacity: 0.0}),
        0.1
    );

    support_box.position.x = position.x;
    support_box.position.y = position.y;
    support_box.position.z = position.z - LEGS_HEIGHT/2;

    support_box.add(box);
    scene.add(support_box);

    // ==== legs ====
    var right_leg = new Physijs.BoxMesh(
        new THREE.BoxGeometry(4, 4, LEGS_HEIGHT),
        new THREE.MeshBasicMaterial({ color: 0xdeadbe, wireframe: true }),
        0.1
    );
    right_leg.position.x = position.x;
    right_leg.position.y = position.y + 3;
    right_leg.position.z = position.z;// - 3 - LEGS_HEIGHT;
    scene.add(right_leg);

    var left_leg = new Physijs.BoxMesh(
        new THREE.BoxGeometry(4, 4, LEGS_HEIGHT),
        new THREE.MeshBasicMaterial({ color: 0xdeadbe, wireframe: true }),
        0.1
    );
    left_leg.position.x = position.x;
    left_leg.position.y = position.y - 3;
    left_leg.position.z = position.z;//  - LEGS_HEIGHT;
    scene.add(left_leg);

    // ==== constraints ====
    
    var right_leg_constraint = new Physijs.HingeConstraint(
        right_leg,
        box,
        new THREE.Vector3( 0, 0, 23 ), // point in the scene to apply the constraint
        new THREE.Vector3( 1, 0, 0 ) // Axis along which the hinge lies - in this case it is the X axis
    );
    scene.addConstraint(right_leg_constraint);

    /*
    var left_leg_constraint = new Physijs.HingeConstraint(
        left_leg,
        box,
        new THREE.Vector3( 0, 0, 0 ), // point in the scene to apply the constraint
        new THREE.Vector3( 1, 0, 0 ) // Axis along which the hinge lies - in this case it is the X axis
    );
    scene.addConstraint(left_leg_constraint);
    */
    
    
    // box.rotation.x = Math.PI/8;
    // car_body.receiveShadow = car_body.castShadow = true;
    // box.setAngularFactor(new THREE.Vector3( 0, 0, 0 ));
    // box.setCcdMotionThreshold(0.1);
    // box.setCcdSweptSphereRadius(1);

    return support_box;
}

function scene_init(scene) {
    scene.background = new THREE.Color().setHSL( 0.51, 0.8, 0.08 );
    scene.fog = new THREE.Fog( scene.background, 3500, 15000 );

    scene.setGravity(new THREE.Vector3( 0, 0, -60 ));

    // var texture = new THREE.TextureLoader().load( 'textures/crate.gif' );

    var custom_geometry = new THREE.Geometry();

    custom_geometry.vertices.push(
        new THREE.Vector3(0, 10, 0),
        new THREE.Vector3(10, 0, 0),
        new THREE.Vector3(10, 10, 0),
        new THREE.Vector3(10, 10, 10),

        /*
        new THREE.Vector3(0, 10, -10),
        new THREE.Vector3(10, 10, -20),
        new THREE.Vector3(10, 0, -10),
        */
    );

    custom_geometry.faces.push(
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(1, 2, 3),
        new THREE.Face3(2, 3, 0),
        new THREE.Face3(3, 0, 1),
        // new THREE.Face3(4, 5, 6)
    );

    var box_geometry = new THREE.BoxBufferGeometry( 100, 200, 100 );
    // var basic_material = new THREE.MeshBasicMaterial( { map: texture } );
    var basic_material = new THREE.MeshBasicMaterial( { color: 0xdeadbe, wireframe: true } );

    var void_material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff,
        shininess: 50
    });
    void_material.transparent = true;
    void_material.opacity = 0.8;

    var ground = new Physijs.BoxMesh(
        new THREE.BoxGeometry(200, 100, 1),
        void_material,
        0 // mass
    );
    scene.add(ground);

    player = make_player(scene, new THREE.Vector3( 0, 0, 30 ));
    // player.position.z = 40;

    var building = new Physijs.BoxMesh(
        new THREE.BoxGeometry(10, 10, 10),
        basic_material,
        1000
    );
    building.position.z = 5;
    building.position.y = 7;
    // car_body.receiveShadow = car_body.castShadow = true;
    scene.add(building);

    custom_object = new Physijs.ConcaveMesh(custom_geometry, basic_material, 1000);
    custom_object.position.z = 30;
    custom_object.position.x = 20;
    // scene.add(custom_object);

    /*var constraint = new Physijs.DOFConstraint(
        custom_object,
        undefined,
        new THREE.Vector3( 0, 0, 0 )
    );*/
    // scene.addConstraint(constraint);
    // constraint.setAngularLowerLimit( new THREE.Vector3( 0, -Math.PI, 0 ) );
    // constraint.setAngularUpperLimit( new THREE.Vector3( 0, Math.PI, 0 ) );
}

function scene_update(scene, t, delta) {
    // custom_object.rotation.x += 0.01;
    player.setAngularFactor(new THREE.Vector3( 0, 0, 0 ));
    player.setAngularVelocity(new THREE.Vector3( 0, 0, 0 ));
    player.rotation.x = 0;
    player.rotation.y = 0;
}