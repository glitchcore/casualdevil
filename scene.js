var box_0;
var custom_object;

var player;

var left_leg_constraint;
var right_leg_constraint;

var IDLE = 0;
var LEFT = 1;
var RIGHT = 2;

var controls = {
    forward: false,
    run: false,
    turn: IDLE,
    shoot_event: null,
    jump_event: null,

    key_state: {}
};

document.addEventListener(
    'keydown',
    function(ev) {
        if(!(ev.keyCode in controls.key_state)) {
            controls.key_state[ev.keyCode] = null;
            // console.log("press:", ev.keyCode);
            switch(ev.keyCode) {
                case 37:
                    // Left
                    console.log("turn Left");
                    controls.turn = LEFT;
                break;
                case 39:
                    // Right
                    console.log("turn Right");
                    controls.turn = RIGHT;
                break;
                case 38:
                    // Up
                    console.log("Run");
                    controls.forward = true;
                break;

                case 32:
                    // space
                    console.log("Jump");
                    controls.jump_event = true;
                break;

                case 88:
                    // x
                    console.log("Shoot");
                    controls.shoot_event = true;
                break;

                case 16:
                    // Lshift
                    console.log("Speed up");
                    controls.run = true;
                break;
            }
        }
    }
);

document.addEventListener(
    'keyup',
    function(ev) {
        if(ev.keyCode in controls.key_state) {
            delete controls.key_state[ev.keyCode];
            switch(ev.keyCode) {
                case 37:
                    // Left
                    console.log("Left -> idle");
                    controls.turn = IDLE;
                break;
                case 39:
                    // Right
                    console.log("Right -> idle");
                    controls.turn = IDLE;
                break;
                
                case 38:
                    // Up
                    console.log("Stop");
                    controls.forward = false;
                break;

                case 16:
                    // Lshift
                    console.log("Speed normal");
                    controls.run = false;
                break;
            }
        }
    }
);

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
        new THREE.BoxGeometry(1, 1, LEGS_HEIGHT/2),
        new THREE.MeshLambertMaterial({color: 0xffffff, transparent: true, opacity: 0.0}),
        1000
    );

    support_box.position.x = position.x;
    support_box.position.y = position.y;
    support_box.position.z = position.z - LEGS_HEIGHT/2;

    support_box.add(box);
    scene.add(support_box);

    // ==== legs ====
    var right_leg = new Physijs.BoxMesh(
        new THREE.BoxGeometry(4, 4, LEGS_HEIGHT + 8),
        new THREE.MeshBasicMaterial({ color: 0xdeadbe, wireframe: true }),
        1
    );
    right_leg.position.x = position.x;
    right_leg.position.y = position.y + 8;
    right_leg.position.z = position.z;// - 3 - LEGS_HEIGHT;
    scene.add(right_leg);
    
    var left_leg = new Physijs.BoxMesh(
        new THREE.BoxGeometry(4, 4, LEGS_HEIGHT + 8),
        new THREE.MeshBasicMaterial({ color: 0xdeadbe, wireframe: true }),
        1
    );
    left_leg.position.x = position.x;
    left_leg.position.y = position.y - 8;
    left_leg.position.z = position.z;//  - LEGS_HEIGHT;
    scene.add(left_leg);
    

    // ==== constraints ====
    
    right_leg_constraint = new Physijs.DOFConstraint(
        right_leg,
        support_box,
        new THREE.Vector3(position.x, position.y + 8, position.z + LEGS_HEIGHT/2 + 4), // point in the scene to apply the constraint
        // new THREE.Vector3(0, 1, 0) // Axis along which the hinge lies - in this case it is the X axis
    );
    

    left_leg_constraint = new Physijs.DOFConstraint(
        left_leg,
        support_box,
        new THREE.Vector3(position.x, position.y - 8, position.z + LEGS_HEIGHT/2 + 4), // point in the scene to apply the constraint
        // new THREE.Vector3( 0, 1, 0 ) // Axis along which the hinge lies - in this case it is the X axis
    );

    scene.addConstraint(left_leg_constraint);
    scene.addConstraint(right_leg_constraint);

    left_leg_constraint.enableAngularMotor(1);
    right_leg_constraint.enableAngularMotor(1);

    left_leg_constraint.setAngularLowerLimit({ x: 0, y: -Math.PI, z: 0 });
    left_leg_constraint.setAngularUpperLimit({ x: 0, y: Math.PI, z: 0 });
    right_leg_constraint.setAngularLowerLimit({ x: 0, y: -Math.PI, z: 0 });
    right_leg_constraint.setAngularUpperLimit({ x: 0, y: Math.PI, z: 0 });

    //right_leg_constraint.setAngularLowerLimit({ x: 0, y: 0, z: 0 });
    //right_leg_constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });

    // left_leg_constraint.configureAngularMotor(1, -Math.PI*1/8, Math.PI*1/8, 10, 200);
    // left_leg_constraint.enableAngularMotor(1);
    /*
    right_leg_constraint.setLimits(
        -Math.PI, // minimum angle of motion, in radians
        Math.PI, // maximum angle of motion, in radians
        100, // applied as a factor to constraint error
        0, // controls bounce at limit (0.0 == no bounce)
    );
    
    left_leg_constraint.setLimits(
        -Math.PI, // minimum angle of motion, in radians
        Math.PI, // maximum angle of motion, in radians
        100, // applied as a factor to constraint error
        1, // controls bounce at limit (0.0 == no bounce)
    );
    */
    
    // box.rotation.x = Math.PI/8;
    // car_body.receiveShadow = car_body.castShadow = true;
    // box.setAngularFactor(new THREE.Vector3( 0, 0, 0 ));
    // box.setCcdMotionThreshold(0.1);
    // box.setCcdSweptSphereRadius(1);

    /*
    var car_body = new Physijs.BoxMesh(
        new THREE.BoxGeometry( 10, 5, 7 ),
        car_material,
        1000
    );
    car_body.position.y = 10;
    // car_body.receiveShadow = car_body.castShadow = true;
    scene.add(car_body);
    
    var car_wheel = new Physijs.CylinderMesh(
        wheel_geometry,
        wheel_material,
        500
    );
    car_wheel.rotation.x = Math.PI / 2;
    car_wheel.position.set( 3.5, 6.5, 5 );
    // car.wheel_bl.receiveShadow = car.wheel_bl.castShadow = true;
    scene.add( car.wheel_bl );
    var car_wheel_constraint = new Physijs.DOFConstraint(
        car_wheel, car_body, new THREE.Vector3( 10,10,10 )
    );
    scene.addConstraint(car_wheel_constraint);
    car_wheel_constraint.setAngularLowerLimit({ x: 0, y: 0, z: 0 });
    car_wheel_constraint.setAngularUpperLimit({ x: 0, y: 0, z: 0 });

    car.wheel_bl_constraint.configureAngularMotor( 2, 1, 0, 20, 5000 );
    //car.wheel_br_constraint.configureAngularMotor( 2, 1, 0, 20, 5000 );
    car.wheel_bl_constraint.enableAngularMotor( 2 );
    */

    return support_box;
}

function scene_init(scene) {
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 15000 );

    camera.position.set(0, 200, 10);
    camera.rotation.x = -Math.PI/2;
    camera.rotation.y = 0;
    camera.rotation.z = -Math.PI;

    /*
    camera.position.set(200, 0, 10);
    camera.rotation.x = -2.361533347852155;
    camera.rotation.y = 1.5506897537101544;
    camera.rotation.z = -2.353;
    */

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
        new THREE.BoxGeometry(4000, 2000, 1, 10,10,10),
        new THREE.MeshBasicMaterial({color: 0xdeadbe, wireframe: true}),
        0 // mass
    );
    scene.add(ground);

    player = make_player(scene, new THREE.Vector3( 0, 0, 20 ));
    // player.position.z = 40;

    var building = new Physijs.BoxMesh(
        new THREE.BoxGeometry(10, 10, 10),
        basic_material,
        1000
    );
    building.position.z = 5;
    building.position.y = 7;
    // car_body.receiveShadow = car_body.castShadow = true;
    // scene.add(building);

    custom_object = new Physijs.ConcaveMesh(custom_geometry, basic_material, 1000);
    custom_object.position.z = 30;
    custom_object.position.x = 20;
    // scene.add(custom_object);

    return camera;
}

var flag = 0;

function scene_update(scene, t, delta) {
    // custom_object.rotation.x += 0.01;
    

    if(t*3 % 2 > 1 && flag == 1) {
        // console.log("set to odd");
        left_leg_constraint.configureAngularMotor(1, -Math.PI/2, Math.PI/6, 100, 1000);
        right_leg_constraint.configureAngularMotor(1, -Math.PI/6, Math.PI/2, -100, 1000);
        flag = 0;
    }

    if(t*3 % 2 <= 1 && flag == 0) {
        // console.log("set to even");
        left_leg_constraint.configureAngularMotor(1, -Math.PI/6, Math.PI/2, -100, 1000);
        right_leg_constraint.configureAngularMotor(1, -Math.PI/2, Math.PI/6, 100, 1000);
        flag = 1;
    }

    if(controls.turn === LEFT) {
        player.setAngularVelocity(new THREE.Vector3(0, 0, 1.2));
    } else if(controls.turn === RIGHT) {
        player.setAngularVelocity(new THREE.Vector3(0, 0, -1.2));
    } else { // IDLE
        player.setAngularVelocity(new THREE.Vector3(0, 0, 0));
    }

    camera.position.set(
        player.position.x + 250*Math.cos(player.rotation.z),
        player.position.y + 250*Math.sin(player.rotation.z),
        player.position.z + 60
    );
    camera.rotation.x = -Math.PI/2;
    camera.rotation.y = -player.rotation.z + Math.PI/2;
    camera.rotation.z = -Math.PI;

    // console.log("angle:", player.rotation.z);

    
    // player.setAngularFactor(new THREE.Vector3( 0, 0, 0 ));
    
    // player.setLinearVelocity(new THREE.Vector3(5, 0, 0));
    // player.rotation.z += 0.05;
    // player.rotation.y = 0;    
}