module.exports.controller = (function() {
    let controllers = {};
    let pressedButtons = {};
    let pressedAxes = {};

    function setButtons(button, status) {
        pressedButtons[button] = status;
    }

    function setAxes(axes, value) {
        pressedAxes[axes] = value;
    }

    function scanGamepads() {
        let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
        
        if (!gamepads) {
            return;
        }

        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {

                // add gamepad if index is not found in controllers object
                if (!(gamepads[i].index in controllers)) {
                    controllers[gamepads[i].index] = gamepads[i];
                }

            }
        }
        
        updateStatus();
    }

    function updateStatus() {
        for (c in controllers) {
            let controller = controllers[c];

            // update controller buttons
            for (let i = 0; i < controller.buttons.length; i++) {
                let button = controller.buttons[i];
                let value = button.value;
                let pressed = (value === 1.0);
                
                if (typeof(button) === "object") {
                    button = `button[${i}]`;

                    if (pressed) {
                        setButtons(button, true);
                    } else {
                        setButtons(button, false);
                    }
                }
            }

            // update controller axes
            for (let i = 0; i < controller.axes.length; i++) {
                let axes = controller.axes[i];
                let value = axes;
               
                if (typeof(axes) === "number") {
                    axes = `axes[${i}]`;
                    setAxes(axes, value);
                }
            }
        }
    }

    function updateController() {
        window.requestAnimationFrame(updateController);

        scanGamepads();
    }

    window.addEventListener('gamepadconnected', function(event) {
        controllers[event.gamepad.index] = event.gamepad;
        console.log('Controller connected:', event.gamepad);
    });

    window.addEventListener('gamepaddisconnected', function(event) {
        delete controllers[event.gamepad.index];
        console.log('Controller disconnected', event.gamepad);
    });

    window.controller = {
        isPressed: function(button) {
            return pressedButtons[button];
        },
        isMoved: function(axes) {
            // buffer for controller sensitivity
            const threshold = 0.09;

            let number = pressedAxes[axes];
            let percentage = (Math.abs(number) - threshold) / (1 - threshold);

            if (percentage < 0) {
                percentage = 0;
            }

            return percentage * (number > 0 ? 1 : -1);
        }
    };

    updateController();
})();