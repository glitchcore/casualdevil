
function player_init(scene, position) {
    var LEGS_HEIGHT = 20;
    var BODY_HEIGHT = 15;

    /*var material = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        specular: 0xffffff,
        shininess: 100
    });
    */
    var material = new THREE.MeshBasicMaterial({color: 0xdeadbe, wireframe: true});

    /*
    var box = new Physijs.BoxMesh(
        new THREE.BoxGeometry(10, 10, BODY_HEIGHT),
        material,
        1000
    );
    */

    var body_geometry = new THREE.Geometry();

    var depth = 6;
    var width = 3;
    var height = 3;
    
    body_geometry.vertices.push(
        new THREE.Vector3(0, 3 * width, 0 * height),
        new THREE.Vector3(0, 1 * width, 4 * height),
        new THREE.Vector3(0, 0 * width, 11 * height),
        new THREE.Vector3(0, 3 * width, 15 * height),
        new THREE.Vector3(0, 5 * width, 15 * height),
        new THREE.Vector3(0, 8 * width, 11 * height),
        new THREE.Vector3(0, 7 * width, 4 * height),
        new THREE.Vector3(0, 5 * width, 0 * height),

        new THREE.Vector3(depth, 3 * width, 0 * height),
        new THREE.Vector3(depth, 1 * width, 4 * width),
        new THREE.Vector3(depth, 0 * width, 11 * width),
        new THREE.Vector3(depth, 3 * width, 15 * width),
        new THREE.Vector3(depth, 5 * width, 15 * width),
        new THREE.Vector3(depth, 8 * width, 11 * width),
        new THREE.Vector3(depth, 7 * width, 4 * width),
        new THREE.Vector3(depth, 5 * width, 0 * width),

        //head
        new THREE.Vector3(0, 4 * width, 16 * height),
        new THREE.Vector3(0, 2 * width, 18 * height),
        new THREE.Vector3(0, 3 * width, 21 * height),
        new THREE.Vector3(0, 5 * width, 21 * height),
        new THREE.Vector3(0, 6 * width, 18 * height),

        new THREE.Vector3(depth, 4 * width, 16 * height),
        new THREE.Vector3(depth, 2 * width, 18 * height),
        new THREE.Vector3(depth, 3 * width, 21 * height),
        new THREE.Vector3(depth, 5 * width, 21 * height),
        new THREE.Vector3(depth, 6 * width, 18 * height),
    );


    body_geometry.faces.push(
        new THREE.Face3(0, 6, 7),
        new THREE.Face3(0, 5, 6),
        new THREE.Face3(0, 1, 5),
        new THREE.Face3(1, 4, 5),
        new THREE.Face3(1, 2, 4),
        new THREE.Face3(2, 3, 4),

        new THREE.Face3(8, 14, 15),
        new THREE.Face3(8, 13, 14),
        new THREE.Face3(8, 9, 13),
        new THREE.Face3(9, 12, 13),
        new THREE.Face3(9, 10, 12),
        new THREE.Face3(10, 11, 12),

        new THREE.Face3(0, 8, 1),
        new THREE.Face3(8, 9, 1),

        new THREE.Face3(9, 10, 1),
        new THREE.Face3(10, 2, 1),

        new THREE.Face3(10, 11, 2),
        new THREE.Face3(11, 3, 2),

        new THREE.Face3(3, 11, 4),
        new THREE.Face3(11, 12, 4),

        new THREE.Face3(13, 12, 5),
        new THREE.Face3(12, 4, 5),

        new THREE.Face3(14, 13, 6),
        new THREE.Face3(13, 5, 6),

        new THREE.Face3(15, 14, 7),
        new THREE.Face3(14, 6, 7),

        new THREE.Face3(0, 8, 7),
        new THREE.Face3(8, 15, 7),

        // head
        new THREE.Face3(16, 17, 20),
        new THREE.Face3(17, 18, 20),
        new THREE.Face3(18, 19, 20),
        new THREE.Face3(21, 22, 25),
        new THREE.Face3(22, 23, 25),
        new THREE.Face3(23, 24, 25),

        new THREE.Face3(21, 22, 16),
        new THREE.Face3(22, 17, 16),

        new THREE.Face3(22, 23, 17),
        new THREE.Face3(23, 18, 17),

        new THREE.Face3(18, 23, 19),
        new THREE.Face3(23, 24, 19),

        new THREE.Face3(25, 24, 20),
        new THREE.Face3(24, 19, 20),

        new THREE.Face3(21, 25, 16),
        new THREE.Face3(25, 20, 16),  
    );

    /*
    body_geometry.vertices.push(
        new THREE.Vector3(0, 10, 0),
        new THREE.Vector3(10, 0, 0),
        new THREE.Vector3(10, 10, 0),
        new THREE.Vector3(10, 10, 10),

        /*
        new THREE.Vector3(0, 10, -10),
        new THREE.Vector3(10, 10, -20),
        new THREE.Vector3(10, 0, -10),
        *
    );

    body_geometry.faces.push(
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(1, 2, 3),
        new THREE.Face3(2, 3, 0),
        new THREE.Face3(3, 0, 1),
        // new THREE.Face3(4, 5, 6)
    );
    */

    var box = new Physijs.ConvexMesh(
        body_geometry,
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
    var leg_geometry = new THREE.Geometry();

    leg_geometry.vertices.push(
        new THREE.Vector3(0, 0 * width, 0 * height),
        new THREE.Vector3(0, 2 * width, 14 * height),
        new THREE.Vector3(0, 4 * width, 10 * height),

        new THREE.Vector3(depth, 2 * width, 14 * height),
        new THREE.Vector3(depth, 4 * width, 10 * height),
    );

    leg_geometry.faces.push(
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(0, 3, 1),
        new THREE.Face3(1, 3, 2),
        new THREE.Face3(3, 4, 2),
        new THREE.Face3(0, 4, 2),
    );

    var right_leg = new Physijs.ConvexMesh(
        leg_geometry,
        material,
        1
    );

    right_leg.position.x = position.x;
    right_leg.position.y = position.y + 10;
    right_leg.position.z = position.z;// - 3 - LEGS_HEIGHT;
    scene.add(right_leg);
    
    var left_leg = new Physijs.ConvexMesh(
        leg_geometry,
        material,
        1
    );
    left_leg.position.x = position.x;
    left_leg.position.y = position.y - 10;
    left_leg.position.z = position.z;//  - LEGS_HEIGHT;
    scene.add(left_leg);

    var player = support_box;
    player.legs = {};
    
    // ==== constraints ====
    player.legs.right = new Physijs.DOFConstraint(
        right_leg,
        support_box,
        new THREE.Vector3(position.x, position.y + 10, position.z + LEGS_HEIGHT/2 + 4), // point in the scene to apply the constraint
        // new THREE.Vector3(0, 1, 0) // Axis along which the hinge lies - in this case it is the X axis
    );
    

    player.legs.left = new Physijs.DOFConstraint(
        left_leg,
        support_box,
        new THREE.Vector3(position.x, position.y - 10, position.z + LEGS_HEIGHT/2 + 4), // point in the scene to apply the constraint
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

    // box.rotation.x = Math.PI/8;
    // car_body.receiveShadow = car_body.castShadow = true;
    // box.setAngularFactor(new THREE.Vector3( 0, 0, 0 ));
    // box.setCcdMotionThreshold(0.1);
    // box.setCcdSweptSphereRadius(1);

    return player;
}

var legs_flag = 0;
var legs_speed = 400;

function player_control(v) {
    var player = v.player;
    var controls = v.controls;
    var scene = v.scene;
    var t = v.t;
    var delta = v.delta;
    
    if(controls.jump_event === true) {
        controls.jump_event = t + 0.2;
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
}

function player_update(v) {
    var player = v.player;
    var scene = v.scene;
    var t = v.t;
    var delta = v.delta;

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

    // console.log("speed:", speed);
    
    // player.setAngularFactor(new THREE.Vector3( 0, 0, 0 ));
    
    // player.setLinearVelocity(new THREE.Vector3(5, 0, 0));
    // player.rotation.z += 0.05;
    // player.rotation.y = 0; 
}