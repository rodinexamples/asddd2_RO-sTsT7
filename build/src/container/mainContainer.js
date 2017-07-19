'use strict';

System.register(['rodin/core', '../components/BlinkAnimation.js', './videoContainer.js', '../components/Navigation.js', '../components/Thumbnail.js'], function (_export, _context) {
    "use strict";

    var RODIN, blinkAnimation, VideoContainer, Navigation, Thumbnail, _createClass, MainContainer;

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
        }, function (_componentsBlinkAnimationJs) {
            blinkAnimation = _componentsBlinkAnimationJs.blinkAnimation;
        }, function (_videoContainerJs) {
            VideoContainer = _videoContainerJs.VideoContainer;
        }, function (_componentsNavigationJs) {
            Navigation = _componentsNavigationJs.Navigation;
        }, function (_componentsThumbnailJs) {
            Thumbnail = _componentsThumbnailJs.Thumbnail;
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

            _export('MainContainer', MainContainer = function (_RODIN$Sculpt) {
                _inherits(MainContainer, _RODIN$Sculpt);

                function MainContainer() {
                    _classCallCheck(this, MainContainer);

                    var _this = _possibleConstructorReturn(this, (MainContainer.__proto__ || Object.getPrototypeOf(MainContainer)).call(this));

                    /**
                     * skybox for all the environment
                     * at first it has space texture
                     * later the texture is changed to
                     * another environment
                     * @type {RODIN.Sphere}
                     */
                    _this.enviroment = new RODIN.Sphere(90, 720, 4, new THREE.MeshBasicMaterial({
                        side: THREE.BackSide,
                        map: RODIN.Loader.loadTexture('./src/assets/space.jpg')
                    }));
                    _this.enviroment.on(RODIN.CONST.READY, function () {
                        _this.enviroment.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, _this.onButtonDown.bind(_this));
                    });
                    /**
                     * Loading placeholder
                     * @type {RODIN.Plane}
                     */
                    _this.loader = new RODIN.Plane(8, 4.5, new THREE.MeshBasicMaterial({
                        transparent: true,
                        map: RODIN.Loader.loadTexture('./src/assets/loader.png')
                    }));
                    _this.loader.on(RODIN.CONST.READY, function (env) {
                        _this.enviroment.add(env.target);
                        env.target.position.z = -10;
                        env.target.position.y = 2.25;
                    });
                    _this.enviroment.needsUpdate = true;
                    _this.transition = blinkAnimation.get();
                    _this.containers = {};
                    return _this;
                }

                _createClass(MainContainer, [{
                    key: 'onButtonDown',
                    value: function onButtonDown() {
                        if (this.containers.videoContainer && this.containers.videoContainer.thumbs) {
                            Thumbnail.reset(this.containers.videoContainer.thumbs);
                        }
                    }
                }, {
                    key: 'run',
                    value: function run() {
                        var _this2 = this;

                        /**
                         * add our skybox to the scene so it can be rendered
                         */
                        RODIN.Scene.add(this.enviroment);
                        RODIN.Scene.HMDCamera.name = 'mainCamera';
                        /**
                         * set the camera for our eyelid transition
                         */
                        this.transition.camera = RODIN.Scene.HMDCamera;

                        /**
                         * Dummy loading time with a splash screen
                         * if you have something to load
                         * do it here
                         */
                        setTimeout(function () {
                            // start our closing animation
                            _this2.transition.close();
                        }, 5000);

                        /**
                         * eyelid transition event
                         * when the lids are closed we change the environment
                         * and start opening them again
                         * This way environment is changed in a "blink" of an eye
                         * @param evt
                         */
                        var onclose = function onclose(evt) {
                            _this2.transition.removeEventListener('Closed', onclose);
                            _this2.changeEnvironment();
                            _this2.transition.open();
                        };
                        this.transition.on('Closed', onclose);
                    }
                }, {
                    key: 'changeEnvironment',
                    value: function changeEnvironment() {
                        this.loader.visible = false;
                        this.enviroment._threeObject.material.map = RODIN.Loader.loadTexture('./src/assets/env.jpg');
                        var videoContainer = new VideoContainer(this.transition);
                        this.containers.navigation = new Navigation(videoContainer);
                        this.containers.videoContainer = videoContainer;
                    }
                }]);

                return MainContainer;
            }(RODIN.Sculpt));

            _export('MainContainer', MainContainer);
        }
    };
});