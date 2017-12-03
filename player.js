
function player_init(scene, position) {
    var LEGS_HEIGHT = 20;
    var BODY_HEIGHT = 15;

    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0xffffff,
        shininess: 100
    });

    var box = new Physijs.BoxMesh(
        new THREE.BoxGeometry(10, 10, BODY_HEIGHT),
        material,
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
        material,
        1
    );
    right_leg.position.x = position.x;
    right_leg.position.y = position.y + 8;
    right_leg.position.z = position.z;// - 3 - LEGS_HEIGHT;
    scene.add(right_leg);
    
    var left_leg = new Physijs.BoxMesh(
        new THREE.BoxGeometry(4, 4, LEGS_HEIGHT + 8),
        material,
        1
    );
    left_leg.position.x = position.x;
    left_leg.position.y = position.y - 8;
    left_leg.position.z = position.z;//  - LEGS_HEIGHT;
    scene.add(left_leg);

    var player = support_box;
    player.legs = {};
    
    // ==== constraints ====
    player.legs.right = new Physijs.DOFConstraint(
        right_leg,
        support_box,
        new THREE.Vector3(position.x, position.y + 8, position.z + LEGS_HEIGHT/2 + 4), // point in the scene to apply the constraint
        // new THREE.Vector3(0, 1, 0) // Axis along which the hinge lies - in this case it is the X axis
    );
    

    player.legs.left = new Physijs.DOFConstraint(
        left_leg,
        support_box,
        new THREE.Vector3(position.x, position.y - 8, position.z + LEGS_HEIGHT/2 + 4), // point in the scene to apply the constraint
        // new THREE.Vector3( 0, 1, 0 ) // Axis along which the hinge lies - in this case it is the X axis
    );

    scene.addConstraint(player.legs.right);
    scene.addConstraint(player.legs.left);

    player.legs.right.enableAngularMotor(1);
    player.legs.left.enableAngularMotor(1);

    player.legs.right.setAngularLowerLimit({ x: 0, y: -Math.PI, z: 0 });
    player.legs.right.setAngularUpperLimit({ x: 0, y: Math.PI, z: 0 });
    player.legs.left.setAngularLowerLimit({ x: 0, y: -Math.PI, z: 0 });
    player.legs.left.setAngularUpperLimit({ x: 0, y: Math.PI, z: 0 });

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

    return player;
}

var legs_flag = 0;
var legs_speed = 400;

function player_update(v) {
    var player = v.player;
    var controls = v.controls;
    var scene = v.scene;
    var t = v.t;
    var delta = v.delta;

    if(controls.jump_event === true) {
        controls.jump_event = t + 0.2;
    }
    // custom_object.rotation.x += 0.01;
    var speed = player.getLinearVelocity().length();

    if(speed > 400) {
        player.setLinearVelocity(
            new THREE.Vector3(
                player.getLinearVelocity().x * 0.8,
                player.getLinearVelocity().y * 0.8,
                player.getLinearVelocity().z
            )
        )
    }

    if(t*legs_speed % 2 > 1 && legs_flag == 1) {
        // legs_speed = speed;
        // console.log("set to odd");
        player.legs.left.configureAngularMotor(1, -Math.PI/2, Math.PI/6, 100, 1000);
        player.legs.right.configureAngularMotor(1, -Math.PI/6, Math.PI/2, -100, 1000);
        legs_flag = 0;
    }

    if(t*legs_speed % 2 <= 1 && legs_flag == 0) {
        // legs_speed = speed;
        // console.log("set to even");
        player.legs.left.configureAngularMotor(1, -Math.PI/6, Math.PI/2, -100, 1000);
        player.legs.right.configureAngularMotor(1, -Math.PI/2, Math.PI/6, 100, 1000);
        legs_flag = 1;
    }

    if(controls.turn === LEFT) {
        player.setAngularVelocity(new THREE.Vector3(0, 0, 1.2));
    } else if(controls.turn === RIGHT) {
        player.setAngularVelocity(new THREE.Vector3(0, 0, -1.2));
    } else { // IDLE
        player.setAngularVelocity(new THREE.Vector3(0, 0, 0));
        // player.rotation.x = 0;
        // player.rotation.y = 0;
        // player.__dirtyRotation = true;
    }

    if(controls.forward) {
        legs_speed = 2;
        player.applyCentralImpulse(new THREE.Vector3(
            -6000*Math.cos(player.rotation.z),
            -6000*Math.sin(player.rotation.z),
            0
        ));
    } else {
        legs_speed = 0;
        player.setLinearVelocity(
            new THREE.Vector3(
                0,
                0,
                player.getLinearVelocity().z
            )
        )
    }

    if(controls.jump_event > t) {
        player.setLinearVelocity(
            new THREE.Vector3(
                player.getLinearVelocity().x,
                player.getLinearVelocity().y,
                100
            )
        )
    }

    // console.log("speed:", speed);
    
    // player.setAngularFactor(new THREE.Vector3( 0, 0, 0 ));
    
    // player.setLinearVelocity(new THREE.Vector3(5, 0, 0));
    // player.rotation.z += 0.05;
    // player.rotation.y = 0; 
}