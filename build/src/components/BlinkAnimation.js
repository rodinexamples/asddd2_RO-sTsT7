'use strict';

System.register(['rodin/core'], function (_export, _context) {
    "use strict";

    var RODIN, _createClass, blinkAnimation;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
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

            _export('blinkAnimation', blinkAnimation = function (_RODIN$EventEmitter) {
                _inherits(blinkAnimation, _RODIN$EventEmitter);

                function blinkAnimation() {
                    _classCallCheck(this, blinkAnimation);

                    var _this = _possibleConstructorReturn(this, (blinkAnimation.__proto__ || Object.getPrototypeOf(blinkAnimation)).call(this));

                    blinkAnimation.instance = _this;
                    /**
                     * empty sculpt for containing our eyelids
                     * @type {RODIN.Sculpt}
                     */
                    _this.eyelidContainer = new RODIN.Sculpt();

                    /**
                     * top eyelid
                     * @type {RODIN.Plane}
                     */
                    _this.topEyelid = new RODIN.Plane(1, 0.05, new THREE.MeshBasicMaterial({
                        side: THREE.DoubleSide,
                        color: 0x000000
                    }));
                    _this.topEyelid.position.z = -0.02;
                    _this.topEyelid.position.y = 0.12;
                    /**
                     * bottom eyelid
                     * @type {RODIN.Plane}
                     */
                    _this.bottomEyelid = new RODIN.Plane(1, 0.05, new THREE.MeshBasicMaterial({
                        side: THREE.DoubleSide,
                        color: 0x000000
                    }));
                    _this.eyelidContainer._threeObject.renderOrder = 10000;
                    _this.bottomEyelid.position.z = -0.02;
                    _this.bottomEyelid.position.y = -0.12;
                    _this.eyelidContainer.add(_this.topEyelid);
                    _this.eyelidContainer.add(_this.bottomEyelid);

                    /**
                     * emit events for when our eye is closed or opened
                     */
                    _this.topEyelid.on(RODIN.CONST.ANIMATION_COMPLETE, function (evt) {
                        if (evt.animation === 'close') {
                            _this.emit('Closed', new RODIN.RodinEvent());
                        } else {
                            _this.emit('Opened', new RODIN.RodinEvent());
                        }
                    });

                    /**
                     * add animations to our eyelids
                     */
                    _this.topEyelid.animation.add(blinkAnimation._makeAnimation(0.12, 'open', 1500));
                    _this.bottomEyelid.animation.add(blinkAnimation._makeAnimation(-0.12, 'open', 1500));

                    _this.topEyelid.animation.add(blinkAnimation._makeAnimation(0.025, 'close', 1500));
                    _this.bottomEyelid.animation.add(blinkAnimation._makeAnimation(-0.025, 'close', 1500));

                    return _this;
                }

                /**
                 * gives user ability to change the parent camera
                 * @param camera
                 */


                _createClass(blinkAnimation, [{
                    key: 'close',
                    value: function close() {
                        this.topEyelid.animation.start('close');
                        this.bottomEyelid.animation.start('close');
                    }
                }, {
                    key: 'open',
                    value: function open() {
                        this.topEyelid.animation.start('open');
                        this.bottomEyelid.animation.start('open');
                    }
                }, {
                    key: 'camera',
                    set: function set(camera) {
                        camera.add(this.eyelidContainer);
                    }
                }], [{
                    key: '_makeAnimation',
                    value: function _makeAnimation(pos, type, duration) {
                        var animate = new RODIN.AnimationClip(type, {
                            position: {
                                y: pos
                            }
                        });
                        animate.duration(duration);
                        return animate;
                    }
                }, {
                    key: 'get',
                    value: function get() {
                        if (!blinkAnimation.instance) {
                            new blinkAnimation();
                        }
                        return blinkAnimation.instance;
                    }
                }]);

                return blinkAnimation;
            }(RODIN.EventEmitter));

            _export('blinkAnimation', blinkAnimation);

            blinkAnimation.instance = null;
        }
    };
});