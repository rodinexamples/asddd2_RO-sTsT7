"use strict";

System.register(["rodin/core"], function (_export, _context) {
    "use strict";

    var RODIN, _createClass, bufferAnimation, hoverAnimation, hoverOutAnimation, scaleOutAnimation, scaleInAnimation, secondsToH_MM_SS, VPcontrolPanel;

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

            bufferAnimation = new RODIN.AnimationClip("bufferAnimation", {
                rotation: {
                    x: 0,
                    y: {
                        from: -Math.PI / 2,
                        to: Math.PI / 2
                    },
                    z: 0
                }
            });

            bufferAnimation.loop(true);
            bufferAnimation.duration(1000);

            hoverAnimation = new RODIN.AnimationClip("hoverAnimation", {
                scale: {
                    x: 1.1,
                    y: 1.1,
                    z: 1.1
                }
            });

            hoverAnimation.duration(200);

            hoverOutAnimation = new RODIN.AnimationClip("hoverOutAnimation", {
                scale: {
                    x: 1,
                    y: 1,
                    z: 1
                }
            });

            hoverOutAnimation.duration(200);

            scaleOutAnimation = new RODIN.AnimationClip("scaleOutAnimation", {
                scale: {
                    x: 0.01,
                    y: 0.01,
                    z: 0.01
                }
            });

            scaleOutAnimation.duration(150);

            scaleInAnimation = new RODIN.AnimationClip("scaleInAnimation", {
                scale: {
                    x: 1,
                    y: 1,
                    z: 1
                }
            });

            scaleInAnimation.duration(150);

            secondsToH_MM_SS = function secondsToH_MM_SS(length) {
                var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ":";

                length = Math.round(length);
                var hours = Math.floor(length / 3600);
                length %= 3600;
                var minutes = Math.floor(length / 60);
                if (minutes < 10 && hours !== 0) {
                    minutes = "0" + minutes;
                }
                var seconds = length % 60;

                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                return (hours !== 0 ? hours + separator : "") + minutes + separator + seconds;
            };

            _export("VPcontrolPanel", VPcontrolPanel = function (_RODIN$Sculpt) {
                _inherits(VPcontrolPanel, _RODIN$Sculpt);

                function VPcontrolPanel(_ref, transition) {
                    var player = _ref.player,
                        _ref$title = _ref.title,
                        title = _ref$title === undefined ? "Untitled Video" : _ref$title,
                        _ref$cover = _ref.cover,
                        cover = _ref$cover === undefined ? null : _ref$cover,
                        _ref$distance = _ref.distance,
                        distance = _ref$distance === undefined ? 1.5 : _ref$distance,
                        _ref$width = _ref.width,
                        width = _ref$width === undefined ? 1.5 : _ref$width;

                    _classCallCheck(this, VPcontrolPanel);

                    var _this = _possibleConstructorReturn(this, (VPcontrolPanel.__proto__ || Object.getPrototypeOf(VPcontrolPanel)).call(this, new THREE.Object3D()));

                    _this.transition = transition;
                    _this.scene = RODIN.Scene.getByName("videoPlayerScene");
                    _this.panel = new RODIN.Sculpt();
                    _this.player = player;
                    _this.cover = cover;
                    _this.width = width;
                    _this.elementsPending = 0;
                    _this.timeBarButton = null;
                    _this.coverEl = null;
                    _this.title = title;

                    _this.panelCenter = new RODIN.Sculpt();

                    _this.panel.parent = _this.panelCenter;
                    _this.panel.position.set(0, 0, -distance);
                    _this.panelCenter.parent = _this;
                    _this.panelCenter.position.set(0, 0, 0);

                    _this.createTitle();
                    _this.createBackButton();
                    _this.createPlayPauseButtons();
                    _this.createTimeLine();
                    _this.createTimeBar();
                    _this.createAudioToggle();
                    _this.createHDToggle();
                    _this.createBackGround(distance, width);
                    _this.createBufferingLogo(distance);
                    _this.cover && _this.createCover(distance, width);
                    _this.hoverOutTime = Infinity;
                    _this.hasCloseAction = false;

                    _this.hoverAction = function (evt) {
                        _this.hoverOutTime = Infinity;
                    };
                    _this.hoverOutAction = function (evt) {
                        _this.hoverOutTime = RODIN.Time.now;
                    };

                    _this.player.onBufferStart = function () {
                        _this.bufferEl.visible = true;
                        console.log("buffering START");
                    };

                    _this.player.onBufferEnd = function () {
                        _this.bufferEl.visible = false;
                        console.log("buffering STOP");
                    };

                    _this.init();
                    return _this;
                }

                _createClass(VPcontrolPanel, [{
                    key: "loadVideo",
                    value: function loadVideo(title, url, cover, sphere) {
                        this.destroy();
                        this.init();
                        this.container = sphere;
                        this.container.visible = false;
                        this.isPlayed = false;
                        this.title = title;
                        this.player.loadVideo(url);
                        this.cover = cover;
                        this.createTitle();
                        this.createCover();
                        this.createTimeBar();
                        this.createHDToggle();

                        this.hideControls();
                        this.showControls();
                    }
                }, {
                    key: "init",
                    value: function init() {
                        var _this2 = this;

                        this.onButtonDown = function () {
                            _this2.buttonDownTime = RODIN.Time.now;
                        };
                        this.scene.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, this.onButtonDown);

                        this.onButtonUp = function () {
                            if (_this2.buttonDownTime && RODIN.Time.now - _this2.buttonDownTime >= 250) return;
                            _this2.toggleControls();
                        };
                        this.scene.on(RODIN.CONST.GAMEPAD_BUTTON_UP, this.onButtonUp);

                        this.onUpdate = function () {
                            if (RODIN.Time.now - _this2.hoverOutTime > 3000 && !_this2.hasCloseAction) {
                                _this2.hideControls();
                                _this2.hasCloseAction = true;
                            }
                        };
                        this.scene.on(RODIN.CONST.UPDATE, this.onUpdate);
                    }
                }, {
                    key: "hideControls",
                    value: function hideControls() {
                        this.panel.parent = null;
                    }
                }, {
                    key: "showControls",
                    value: function showControls() {
                        this.panel.parent = this.panelCenter;
                        var vector = this.scene.avatar.HMDCamera._threeObject.getWorldDirection();
                        var newRot = Math.atan(vector.x / vector.z) + (vector.z < 0 ? Math.PI : 0) + Math.PI;
                        if (Math.abs(this.rotation.y - newRot) >= Math.PI / 3) {
                            this.panelCenter.rotation.y = newRot;
                        }
                        this.hasCloseAction = false;
                        this.hoverOutTime = RODIN.Time.now;
                    }
                }, {
                    key: "toggleControls",
                    value: function toggleControls() {
                        if (this.panel.parent === this.panelCenter) {
                            this.hideControls();
                        } else {
                            this.showControls();
                        }
                    }
                }, {
                    key: "readyCheck",
                    value: function readyCheck() {
                        if (!this.elementsPending) {
                            this.emitAsync(RODIN.CONST.READY, new RODIN.RodinEvent(this));
                        }
                    }
                }, {
                    key: "createBackGround",
                    value: function createBackGround(distance, width) {
                        var r = Math.sqrt(distance * distance + width * width / 4) * 2;

                        var sphere = new RODIN.Sculpt(new THREE.Mesh(new THREE.SphereBufferGeometry(r, 12, 12), new THREE.MeshBasicMaterial({
                            color: 0x000000,
                            transparent: true,
                            opacity: 0.3,
                            side: THREE.BackSide
                        })));

                        sphere._threeObject.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, -r));
                        sphere.parent = this.panel;
                        sphere.position.set(0, 0, r);
                    }
                }, {
                    key: "createCover",
                    value: function createCover(distance, width) {
                        var _this3 = this;

                        var r = Math.sqrt(distance * distance + width * width / 4) * 3;

                        if (this.coverEl && this.coverEl._threeObject) {
                            this.coverEl._threeObject.material.map = new THREE.TextureLoader().load(this.cover);
                            return;
                        }
                        var coverMesh = new THREE.Mesh(new THREE.SphereBufferGeometry(r, 720, 4), new THREE.MeshBasicMaterial({
                            color: 0xffffff,
                            map: new THREE.TextureLoader().load(this.cover),
                            side: THREE.DoubleSide
                        }));

                        coverMesh.scale.set(-1, 1, 1);

                        this.coverEl = new RODIN.Sculpt(coverMesh);
                        this.coverEl.on(RODIN.CONST.READY, function (evt) {
                            // this.coverEl.parent = this;
                            _this3.add(_this3.coverEl);
                        });
                    }
                }, {
                    key: "createBackButton",
                    value: function createBackButton() {
                        var _this4 = this;

                        var backParams = {
                            name: "back",
                            width: this.width / 8,
                            height: this.width / 8,
                            ppm: 500
                        };

                        backParams.background = {
                            image: {
                                url: "./src/assets/icons/backButton.png"
                            },
                            opacity: 0.5
                        };
                        this.elementsPending++;

                        var back = new RODIN.Element(backParams);
                        back.on(RODIN.CONST.READY, function (evt) {
                            evt.target.parent = _this4.panel;
                            evt.target.position.set(-_this4.width / 2.2, _this4.width / 4, 0);
                            evt.target.animation.add(hoverAnimation, hoverOutAnimation);
                            _this4.elementsPending--;
                            _this4.readyCheck();
                        });
                        back.on(RODIN.CONST.GAMEPAD_HOVER, function (evt) {
                            evt.target.animation.start("hoverAnimation");
                        });
                        back.on(RODIN.CONST.GAMEPAD_HOVER_OUT, function (evt) {
                            evt.target.animation.start("hoverOutAnimation");
                        });
                        back.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, function (evt) {
                            evt.stopPropagation();
                            if (_this4.container) {
                                _this4.container.visible = false;
                            }
                            _this4.pauseButton.scale.set(1, 1, 1);
                            _this4.playButton.scale.set(1, 1, 1);
                            if (_this4.pauseButton && _this4.pauseButton.parent) {
                                // this.pauseButton.parent = null;
                                // this.playButton.parent = this.panel;

                                _this4.pauseButton.parent && _this4.pauseButton.parent.remove(_this4.pauseButton);
                                _this4.panel.add(_this4.playButton);
                                _this4.player.pause();
                            }

                            if (_this4.player.getLength()) {
                                _this4.player.jumpTo(0);
                            }
                            _this4.transition.close();

                            var onclose = function onclose(evt) {
                                _this4.transition.removeEventListener('Closed', onclose);

                                RODIN.Scene.go('Main');
                                RODIN.Scene.HMDCamera.name = 'mainCamera';
                                _this4.transition.camera = RODIN.Scene.HMDCamera;

                                // we need this timeout because of a bug in lib
                                // remove this when lib is fixed
                                setTimeout(function () {
                                    _this4.transition.open();
                                }, 0);
                            };

                            _this4.transition.on('Closed', onclose);
                        });
                    }
                }, {
                    key: "createTitle",
                    value: function createTitle() {
                        var _this5 = this;

                        var titleParams = {
                            text: this.title,
                            color: 0xffffff,
                            fontFamily: "Arial",
                            fontSize: this.width * 0.04,
                            ppm: 1000
                        };
                        if (this.titleButton) {
                            this.panel.remove(this.titleButton);
                            this.titleButton = null;
                            delete this.titleButton;
                        }
                        this.titleButton = new RODIN.Text(titleParams);
                        this.elementsPending++;

                        this.titleButton.on(RODIN.CONST.READY, function (evt) {
                            _this5.panel.add(_this5.titleButton);
                            _this5.titleButton.position.set(0, _this5.width / 4, 0);
                            _this5.elementsPending--;
                            _this5.readyCheck();
                        });
                    }
                }, {
                    key: "createPlayPauseButtons",
                    value: function createPlayPauseButtons() {
                        var _this6 = this;

                        var playParams = {
                            name: "play",
                            width: this.width / 5,
                            height: this.width / 5
                        };

                        playParams.background = {
                            color: 0x666666,
                            opacity: 0.3
                        };

                        playParams.border = {
                            radius: this.width / 10
                        };

                        playParams.image = {
                            url: "./src/assets/icons/play.png",
                            width: this.width / 15,
                            height: this.width / 15,
                            position: {
                                h: 54,
                                v: 50
                            }
                        };

                        var playButton = new RODIN.Element(playParams);
                        this.playButton = playButton;
                        this.elementsPending++;

                        playButton.on(RODIN.CONST.READY, function (evt) {
                            // playButton.parent = this.panel;
                            _this6.panel.add(playButton);
                            playButton.position.set(0, 0, 0);
                            playButton.animation.add(hoverAnimation, hoverOutAnimation, scaleOutAnimation, scaleInAnimation);
                            _this6.elementsPending--;
                            _this6.readyCheck();
                        });

                        playButton.on(RODIN.CONST.GAMEPAD_HOVER, function (evt) {
                            _this6.hoverAction(evt);
                            !evt.target.animation.isPlaying() && evt.target.animation.start("hoverAnimation");
                        });

                        playButton.on(RODIN.CONST.GAMEPAD_HOVER_OUT, function (evt) {
                            _this6.hoverOutAction(evt);
                            !evt.target.animation.isPlaying() && evt.target.animation.start("hoverOutAnimation");
                        });

                        playButton.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, function (evt) {
                            evt.stopPropagation();
                            if (_this6.visible) {
                                evt.target.animation.start("scaleOutAnimation");
                            }
                        });

                        playButton.on(RODIN.CONST.ANIMATION_COMPLETE, function (evt) {
                            if (evt.animation === "scaleOutAnimation") {
                                // playButton.parent = null;
                                // pauseButton.parent = this.panel;

                                playButton.parent && playButton.parent.remove(playButton);
                                _this6.panel.add(pauseButton);
                                pauseButton.animation.start("scaleInAnimation");
                                if (_this6.cover && _this6.coverEl) {
                                    _this6.coverEl.visible = false;
                                }
                                _this6.canGo = true;
                                _this6.player.play();
                            }
                        });

                        var pauseParams = {
                            name: "pause",
                            width: this.width / 5,
                            height: this.width / 5
                        };

                        pauseParams.background = {
                            color: 0x666666,
                            opacity: 0.3
                        };

                        pauseParams.border = {
                            radius: this.width / 10
                        };

                        pauseParams.image = {
                            url: "./src/assets/icons/pause.png",
                            width: this.width * 0.04,
                            height: this.width * 0.06,
                            position: {
                                h: 50,
                                v: 50
                            }
                        };

                        var pauseButton = new RODIN.Element(pauseParams);
                        this.pauseButton = pauseButton;
                        this.elementsPending++;

                        pauseButton.on(RODIN.CONST.READY, function (evt) {
                            // pauseButton.parent = this.panel;
                            _this6.panel.add(pauseButton);
                            pauseButton.position.set(0, 0, 0);
                            pauseButton.parent = null;
                            evt.target.animation.add(hoverAnimation, hoverOutAnimation, scaleOutAnimation, scaleInAnimation);
                            _this6.elementsPending--;
                            _this6.readyCheck();
                        });

                        pauseButton.on(RODIN.CONST.GAMEPAD_HOVER, function (evt) {
                            _this6.hoverAction(evt);
                            !evt.target.animation.isPlaying() && evt.target.animation.start("hoverAnimation");
                        });

                        pauseButton.on(RODIN.CONST.GAMEPAD_HOVER_OUT, function (evt) {
                            _this6.hoverOutAction(evt);
                            !evt.target.animation.isPlaying() && evt.target.animation.start("hoverOutAnimation");
                        });

                        pauseButton.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, function (evt) {
                            evt.stopPropagation();
                            if (_this6.visible) {
                                evt.target.animation.start("scaleOutAnimation");
                            }
                        });

                        pauseButton.on(RODIN.CONST.ANIMATION_COMPLETE, function (evt) {
                            if (evt.animation === "scaleOutAnimation") {
                                // pauseButton.parent = null;
                                // playButton.parent = this.panel;

                                pauseButton.parent && pauseButton.parent.remove(pauseButton);
                                _this6.panel.add(playButton);
                                playButton.animation.start("scaleInAnimation");
                                _this6.player.pause();
                            }

                            if (evt.animation === 'scaleInAnimation') {
                                console.log(pauseButton.scale.valueOf());
                            }
                        });
                    }
                }, {
                    key: "createBufferingLogo",
                    value: function createBufferingLogo(distance) {
                        var _this7 = this;

                        var bufferingParams = {
                            name: "buffering",
                            width: this.width / 6,
                            height: this.width / 6
                        };

                        bufferingParams.background = {
                            color: 0x666666,
                            opacity: 0.3
                        };

                        bufferingParams.border = {
                            radius: this.width / 12,
                            width: this.width / 500,
                            color: 0xffffff
                        };

                        bufferingParams.image = {
                            url: "./src/assets/icons/rodin.png",
                            width: this.width / 30,
                            height: this.width / 25,
                            position: {
                                h: 54,
                                v: 35
                            }
                        };
                        bufferingParams.label = {
                            text: "loading",
                            fontSize: this.width / 37.5,
                            color: 0xffffff,
                            position: {
                                h: 50,
                                v: 65
                            }
                        };

                        this.bufferEl = new RODIN.Element(bufferingParams);
                        this.elementsPending++;

                        this.bufferEl.on(RODIN.CONST.READY, function (evt) {
                            _this7.panel.add(_this7.bufferEl);
                            _this7.bufferEl.position.set(0, 0, -distance + bufferingParams.width / 2);
                            _this7.bufferEl.visible = false;
                            _this7.bufferEl.animation.add(bufferAnimation);
                            _this7.bufferEl.animation.start("bufferAnimation");
                            _this7.elementsPending--;
                            _this7.readyCheck();
                        });
                    }
                }, {
                    key: "createTimeLine",
                    value: function createTimeLine() {
                        var _this8 = this;

                        var color = 0xff9a2b;

                        var timeLineBGParams = {
                            name: "timeLineBG",
                            width: this.width,
                            height: this.width / 50,
                            background: {
                                color: 0xaaaaaa,
                                opacity: 0.5
                            }
                        };

                        var timeLineParams = {
                            name: "timeLine",
                            width: this.width,
                            height: this.width / 50,
                            background: {
                                color: color
                            },
                            transparent: false
                        };

                        var caretParams = {
                            name: "caret",
                            width: this.width * 0.024,
                            height: this.width * 0.024,
                            border: {
                                radius: this.width * 0.012
                            },
                            background: {
                                color: 0xffffff
                            },
                            transparent: false
                        };

                        var pointerParams = {
                            name: "pointer",
                            width: this.width * 0.046,
                            height: this.width * 0.046,
                            border: {
                                width: this.width / 500,
                                color: 0xffffff,
                                radius: this.width * 0.023
                            },
                            label: {
                                text: "I",
                                fontSize: this.width / 37.5,
                                color: 0xff0000,
                                position: {
                                    h: 50,
                                    v: 55
                                }
                            }
                        };

                        var pointerTimeParams = {
                            name: "pointerTimeParams",
                            text: "0:00",
                            color: 0xffffff,
                            fontFamily: "Arial",
                            fontSize: this.width / 37.5,
                            ppm: 1000
                        };

                        var timeLineBG = new RODIN.Element(timeLineBGParams);
                        this.elementsPending++;

                        timeLineBG.on(RODIN.CONST.READY, function (evt) {
                            _this8.isVideoReady = true;
                            timeLineBG.parent = _this8.panel;
                            timeLineBG.position.set(0, -_this8.width / 3.75, 0);
                            _this8.elementsPending--;
                            _this8.readyCheck();
                        });

                        timeLineBG.on(RODIN.CONST.GAMEPAD_MOVE, function (evt) {
                            _this8.hoverAction(evt);
                            if (pointer.isReady) {
                                pointer.visible = true;
                                pointer.position.x = evt.uv.x - _this8.width / 2;
                            }

                            if (pointerTime.isReady) {
                                var time = secondsToH_MM_SS(_this8.player.getLength() * evt.uv.x / _this8.width);
                                pointerTime.position.x = evt.uv.x - _this8.width / 2;
                                if (time === pointerTime.lastTime && pointerTime.visible) return;
                                pointerTimeParams.text = time;
                                pointerTime.reDraw(pointerTimeParams);
                                pointerTime.visible = true;
                                pointerTime.lastTime = time;
                            }
                        });

                        timeLineBG.on(RODIN.CONST.GAMEPAD_HOVER_OUT, function (evt) {
                            _this8.hoverOutAction(evt);
                            if (pointer.isReady) {
                                pointer.visible = false;
                            }
                            if (pointerTime.isReady) {
                                pointerTime.visible = false;
                            }
                        });

                        timeLineBG.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, function (evt) {
                            evt.stopPropagation();
                            _this8.player.jumpTo(evt.uv.x / _this8.width);
                        });

                        var timeLine = new RODIN.Element(timeLineParams);
                        this.elementsPending++;

                        timeLine.on(RODIN.CONST.READY, function () {
                            timeLine.parent = _this8.panel;
                            timeLine.position.set(0, -_this8.width / 3.75, 0.0001);
                            timeLine.scale.set(0.0001, 1, 1);
                            _this8.elementsPending--;
                            _this8.readyCheck();
                        });

                        this.timeLine = timeLine;
                        timeLine.on(RODIN.CONST.UPDATE, function (evt) {
                            var time = _this8.player.getTime();
                            time = time ? time : 0.0001;
                            var duration = _this8.player.getLength();
                            if (!duration) return;
                            var scale = time / duration;
                            timeLine.scale.set(scale, 1, 1);
                            timeLine.position.x = (scale - 1) * _this8.width / 2;
                        });

                        var caret = new RODIN.Element(caretParams);
                        this.elementsPending++;

                        caret.on(RODIN.CONST.READY, function (evt) {
                            caret.parent = _this8.panel;
                            caret.position.y = -_this8.width / 3.75;
                            caret.position.z = 0.0002;
                            caret.position.x = -_this8.width / 2;
                            _this8.elementsPending--;
                            _this8.readyCheck();
                        });

                        caret.on('update', function (evt) {
                            if (timeLine.isReady) {
                                caret.position.x = timeLine.scale.x * _this8.width - _this8.width / 2;
                            }
                        });

                        var pointer = new RODIN.Element(pointerParams);
                        this.elementsPending++;

                        pointer.on(RODIN.CONST.READY, function (evt) {
                            pointer.parent = _this8.panel;
                            pointer.position.y = -_this8.width / 3.75;
                            pointer.position.z = 0.0004;
                            pointer._threeObject.material.depthWrite = false;
                            pointer.position.x = -_this8.width / 2;
                            pointer.visible = false;
                            _this8.elementsPending--;
                            _this8.readyCheck();
                        });

                        var pointerTime = new RODIN.Text(pointerTimeParams);
                        this.elementsPending++;

                        pointerTime.on(RODIN.CONST.READY, function (evt) {
                            pointerTime.parent = _this8.panel;
                            pointerTime.position.y = -_this8.width * 0.21;
                            pointerTime.position.z = 0.0004;
                            pointerTime.position.x = 0;
                            pointerTime.visible = false;
                            _this8.elementsPending--;
                            _this8.readyCheck();
                        });

                        this.caret = caret;
                        this.pointer = pointer;
                        this.pointerTime = pointerTime;
                    }
                }, {
                    key: "createTimeBar",
                    value: function createTimeBar() {
                        var _this9 = this;

                        var timeBarParams = {
                            text: "0:00/0:00",
                            color: 0xffffff,
                            fontFamily: "Arial",
                            fontSize: this.width / 30,
                            ppm: 1000
                        };
                        if (this.timeBarButton) {
                            this.panel.remove(this.timeBarButton);
                            this.timeBarButton = null;
                            delete this.timeBarButton;
                        }
                        this.timeBarButton = new RODIN.Text(timeBarParams);
                        this.elementsPending++;
                        this.timeBarButton.on(RODIN.CONST.READY, function (evt) {
                            // this.timeBarButton.parent = this.panel;
                            _this9.panel.add(_this9.timeBarButton);
                            _this9.timeBarButton.position.set(-_this9.width / 2, -_this9.width / 3, 0);
                            _this9.elementsPending--;
                            _this9.readyCheck();
                        });

                        this.timeBarButton.on('update', function (evt) {
                            var time = secondsToH_MM_SS(_this9.player.getTime());
                            var total = secondsToH_MM_SS(_this9.player.getLength());
                            if (time === evt.target.lastTime) return;
                            timeBarParams.text = time + "/" + total;
                            evt.target.reDraw(timeBarParams);
                            if (!isNaN(_this9.player.getLength())) {
                                if (_this9.container) {
                                    _this9.container.visible = true;
                                }
                                evt.target.lastTime = time;
                                if (!_this9.isPlayed) {
                                    // this.playButton.parent = null;
                                    // this.pauseButton.parent = this.panel;

                                    _this9.playButton.parent && _this9.playButton.parent.remove(_this9.playButton);
                                    _this9.panel.add(_this9.pauseButton);

                                    _this9.pauseButton.animation.start("scaleInAnimation");
                                    if (_this9.cover && _this9.coverEl) {
                                        _this9.coverEl.visible = false;
                                    }
                                    _this9.isPlayed = true;
                                    _this9.player.play();
                                }
                            }

                            evt.target._threeObject.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(evt.target._threeObject.geometry.parameters.width / 2, 0, 0));
                        });
                    }
                }, {
                    key: "createAudioToggle",
                    value: function createAudioToggle() {
                        var _this10 = this;

                        var muteParams = {
                            name: "mute",
                            width: this.width * 0.04,
                            height: this.width * 0.04,
                            ppm: 1000
                        };

                        muteParams.image = {
                            url: "./src/assets/icons/audioON.png",
                            width: this.width * 0.04,
                            height: this.width * 0.04,
                            position: {
                                h: 50,
                                v: 50
                            }
                        };

                        var muteButton = new RODIN.Element(muteParams);
                        this.elementsPending++;

                        muteButton.on(RODIN.CONST.READY, function (evt) {
                            muteButton.parent = _this10.panel;
                            muteButton.position.set(-_this10.width / 2, -_this10.width / 3.02, 0);
                            evt.target.animation.add(hoverAnimation, hoverOutAnimation);
                            _this10.elementsPending--;
                            _this10.readyCheck();
                        });

                        muteButton.on('update', function (evt) {
                            if (_this10.timeBarButton) {
                                muteButton.position.x = _this10.timeBarButton.position.x + _this10.timeBarButton.scale.x * _this10.timeBarButton._threeObject.geometry.parameters.width + _this10.width / 30;
                            }
                        });

                        muteButton.on(RODIN.CONST.GAMEPAD_HOVER, function (evt) {
                            _this10.hoverAction(evt);
                            evt.target.animation.start("hoverAnimation");
                        });

                        muteButton.on(RODIN.CONST.GAMEPAD_HOVER_OUT, function (evt) {
                            _this10.hoverOutAction(evt);
                            evt.target.animation.start("hoverOutAnimation");
                        });

                        muteButton.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, function (evt) {
                            evt.stopPropagation();
                            _this10.player.mute(true);
                            muteButton.parent = null;
                            unmuteButton.parent = _this10.panel;
                            unmuteButton.position.set(-_this10.width / 2, -_this10.width / 3.02, 0);
                        });

                        var unmuteParams = {
                            name: "unmute",
                            width: this.width * 0.04,
                            height: this.width * 0.04,
                            ppm: 1000
                        };

                        unmuteParams.image = {
                            url: "./src/assets/icons/audioOFF.png",
                            width: this.width * 0.04,
                            height: this.width * 0.04,
                            opacity: 0.6,
                            position: {
                                h: 50,
                                v: 50
                            }
                        };

                        var unmuteButton = new RODIN.Element(unmuteParams);
                        this.elementsPending++;

                        unmuteButton.on(RODIN.CONST.READY, function (evt) {
                            unmuteButton.parent = _this10.panel;
                            unmuteButton.position.set(-_this10.width / 2, -_this10.width / 3.02, 0);
                            evt.target.animation.add(hoverAnimation, hoverOutAnimation);
                            _this10.elementsPending--;
                            _this10.readyCheck();
                            unmuteButton.parent = null;
                        });

                        unmuteButton.on('update', function (evt) {
                            if (_this10.timeBarButton) {
                                unmuteButton.position.x = _this10.timeBarButton.position.x + _this10.timeBarButton.scale.x * _this10.timeBarButton._threeObject.geometry.parameters.width + _this10.width / 30;
                            }
                        });

                        unmuteButton.on(RODIN.CONST.GAMEPAD_HOVER, function (evt) {
                            _this10.hoverAction(evt);
                            evt.target.animation.start("hoverAnimation");
                        });

                        unmuteButton.on(RODIN.CONST.GAMEPAD_HOVER_OUT, function (evt) {
                            _this10.hoverOutAction(evt);
                            evt.target.animation.start("hoverOutAnimation");
                        });

                        unmuteButton.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, function (evt) {
                            evt.stopPropagation();
                            _this10.player.mute(false);
                            unmuteButton.parent = null;
                            muteButton.parent = _this10.panel;
                            muteButton.position.set(-_this10.width / 2, -_this10.width / 3.02, 0);
                        });
                    }
                }, {
                    key: "createHDToggle",
                    value: function createHDToggle() {
                        var _this11 = this;

                        var HDParams = {
                            text: "HD",
                            color: 0xffffff,
                            fontFamily: "Arial",
                            fontSize: this.width / 30,
                            ppm: 1000
                        };

                        if (this.HDButton && this.HDButton.parent) {
                            this.panel.remove(this.HDButton);
                            // this.HDButton.parent = null;
                            this.HDButton.parent && this.HDButton.parent.remove(this.HDButton);
                            this.HDButton = null;
                            delete this.HDButton;
                        }
                        if (this.SDButton && this.SDButton.parent) {
                            this.panel.remove(this.SDButton);
                            // this.SDButton.parent = null;
                            this.SDButton.parent && this.SDButton.parent.remove(this.SDButton);
                            this.SDButton = null;
                            delete this.SDButton;
                        }
                        this.HDButton = new RODIN.Text(HDParams);

                        this.elementsPending++;

                        this.HDButton.on(RODIN.CONST.READY, function (evt) {
                            // this.HDButton.parent = this.panel;
                            _this11.panel.add(_this11.HDButton);
                            _this11.HDButton.position.set(_this11.width * 0.48, -_this11.width / 3.02, 0);
                            evt.target.animation.add(hoverAnimation, hoverOutAnimation);
                            _this11.elementsPending--;
                            _this11.readyCheck();
                        });

                        this.HDButton.on(RODIN.CONST.GAMEPAD_HOVER, function (evt) {
                            _this11.hoverAction(evt);
                            evt.target.animation.start("hoverAnimation");
                        });

                        this.HDButton.on(RODIN.CONST.GAMEPAD_HOVER_OUT, function (evt) {
                            _this11.hoverOutAction(evt);
                            evt.target.animation.start("hoverOutAnimation");
                        });

                        this.HDButton.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, function (evt) {
                            evt.stopPropagation();
                            var playAfter = _this11.player.isPlaying();
                            _this11.player.switchTo("SD");

                            // this.HDButton.parent = null;
                            // this.SDButton.parent = this.panel;

                            _this11.HDButton.parent && _this11.HDButton.parent.remove(_this11.HDButton);
                            _this11.panel.add(_this11.SDButton);
                            _this11.SDButton.position.set(_this11.width * 0.48, -_this11.width / 3.02, 0);

                            if (playAfter) {
                                _this11.player.play();
                            }
                        });

                        var SDParams = {
                            text: "SD",
                            color: 0xffffff,
                            fontFamily: "Arial",
                            fontSize: this.width / 30,
                            ppm: 1000
                        };
                        this.SDButton = new RODIN.Text(SDParams);

                        this.elementsPending++;

                        this.SDButton.on(RODIN.CONST.READY, function (evt) {
                            // this.SDButton.parent = this.panel;
                            _this11.panel.add(_this11.SDButton);
                            _this11.SDButton.position.set(_this11.width * 0.48, -_this11.width / 3.02, 0);
                            evt.target.animation.add(hoverAnimation, hoverOutAnimation);
                            _this11.elementsPending--;
                            _this11.readyCheck();
                            // this.SDButton.parent = null;
                            _this11.SDButton.parent && _this11.SDButton.parent.remove(_this11.SDButton);
                        });

                        this.SDButton.on(RODIN.CONST.GAMEPAD_HOVER, function (evt) {
                            _this11.hoverAction(evt);
                            evt.target.animation.start("hoverAnimation");
                        });

                        this.SDButton.on(RODIN.CONST.GAMEPAD_HOVER_OUT, function (evt) {
                            _this11.hoverOutAction(evt);
                            evt.target.animation.start("hoverOutAnimation");
                        });

                        this.SDButton.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, function (evt) {
                            evt.stopPropagation();

                            var playAfter = _this11.player.isPlaying();
                            _this11.player.switchTo("HD");

                            // this.SDButton.parent = null;
                            // this.HDButton.parent = this.panel;

                            _this11.SDButton.parent && _this11.SDButton.parent.remove(_this11.SDButton);
                            _this11.panel.add(_this11.HDButton);
                            _this11.HDButton.position.set(_this11.width * 0.48, -_this11.width / 3.02, 0);

                            if (playAfter) {
                                _this11.player.play();
                            }
                        });
                    }
                }, {
                    key: "destroy",
                    value: function destroy() {
                        this.scene.removeEventListener(RODIN.CONST.GAMEPAD_BUTTON_DOWN, this.onButtonDown);
                        this.scene.removeEventListener(RODIN.CONST.GAMEPAD_BUTTON_UP, this.onButtonUp);
                        this.scene.removeEventListener(RODIN.CONST.UPDATE, this.onUpdate);
                    }
                }]);

                return VPcontrolPanel;
            }(RODIN.Sculpt));

            _export("VPcontrolPanel", VPcontrolPanel);
        }
    };
});