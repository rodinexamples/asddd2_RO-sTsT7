'use strict';

System.register(['rodin/core'], function (_export, _context) {
    "use strict";

    var RODIN, _createClass, Button;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_rodinCore) {
            RODIN = _rodinCore;
        }],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            _export('Button', Button = function () {
                function Button(width, height, name, image) {
                    _classCallCheck(this, Button);

                    this.width = width;
                    this.height = height;
                    this.name = name;
                    this.image = image;
                    this.isClicked = false;
                    this.draw();
                }

                /**
                 * renders the button
                 */


                _createClass(Button, [{
                    key: 'draw',
                    value: function draw() {
                        var _this = this;

                        // we use a plane for our buttons
                        this.element = new RODIN.Plane(this.width, this.height, new THREE.MeshBasicMaterial({
                            transparent: true,
                            map: RODIN.Loader.loadTexture('./src/assets/icons/Button_background_short.png')
                        }));
                        this.element._threeObject.renderOrder = 1;
                        this.element._threeObject.material.visible = false;
                        this.element.name = this.name;
                        this.glow = new RODIN.Plane(this.width, this.height, new THREE.MeshBasicMaterial({
                            transparent: true,
                            map: RODIN.Loader.loadTexture('./src/assets/icons/Button_glow.png')
                        }));
                        this.glow._threeObject.renderOrder = 2;
                        this.button = new RODIN.Element({
                            name: this.name,
                            width: this.width,
                            height: this.height,
                            background: {
                                image: {
                                    url: this.image
                                }
                            },
                            border: {
                                radius: this.width / 2
                            },
                            ppm: 2000,
                            transparent: true
                        });

                        this.button.on(RODIN.CONST.READY, function (btn) {
                            _this.element.position.z = 0.005;
                            _this.element.add(_this.glow);
                            _this.glow.position.z = 0.006;
                            _this.glow.scale.set(0.8, .8, .8);
                            _this.element.add(btn.target);
                            btn.target._threeObject.renderOrder = 3;
                            btn.target.scale.set(.8, .8, .8);
                            btn.target.position.z = 0.02;
                        });
                    }
                }, {
                    key: 'active',
                    get: function get() {
                        return this.element;
                    }
                }]);

                return Button;
            }());

            _export('Button', Button);
        }
    };
});