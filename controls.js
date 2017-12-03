
var IDLE = 0;
var LEFT = 1;
var RIGHT = 2;

var controls = {
    forward: false,
    run: false,
    turn: IDLE,
    shoot_event: null,
    jump_event: null,
    restart_event: null,
    mode_event: null,

    key_state: {}
};

document.addEventListener(
    'keydown',
    function(ev) {
        if(!(ev.keyCode in controls.key_state)) {
            controls.key_state[ev.keyCode] = null;
            if(log) console.log("press:", ev.keyCode);
            switch(ev.keyCode) {
                case 37:
                    // Left
                    if(log) console.log("turn Left");
                    controls.turn = LEFT;
                break;
                case 39:
                    // Right
                    if(log) console.log("turn Right");
                    controls.turn = RIGHT;
                break;
                case 38:
                    // Up
                    if(log) console.log("Run");
                    controls.forward = true;
                break;

                case 32:
                    // space
                    if(log) console.log("Jump");
                    controls.jump_event = true;
                break;

                case 88:
                    // x
                    if(log) console.log("Shoot");
                    controls.shoot_event = true;
                break;

                case 16:
                    // Lshift
                    if(log) console.log("Speed up");
                    controls.run = true;
                break;

                case 82:
                    // R
                    if(log) console.log("Restart game");
                    controls.restart_event = true;
                break;

                case 86:
                    // V
                    if(log) console.log("Change view/mode");
                    controls.mode_event = true;
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
                    if(log) console.log("Left -> idle");
                    controls.turn = IDLE;
                break;
                case 39:
                    // Right
                    if(log) console.log("Right -> idle");
                    controls.turn = IDLE;
                break;
                
                case 38:
                    // Up
                    if(log) console.log("Stop");
                    controls.forward = false;
                break;

                case 16:
                    // Lshift
                    if(log) console.log("Speed normal");
                    controls.run = false;
                break;
            }
        }
    }
);
