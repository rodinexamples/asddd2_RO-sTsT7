'use strict';

System.register(['rodin/core', '../data/buttons.js', './Button.js'], function (_export, _context) {
    "use strict";

    var RODIN, Icons, Button, _createClass, Navigation;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_rodinCore) {
            RODIN = _rodinCore;
        }, function (_dataButtonsJs) {
            Icons = _dataButtonsJs.Icons;
        }, function (_ButtonJs) {
            Button = _ButtonJs.Button;
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

            _export('Navigation', Navigation = function () {
                function Navigation(videoContainer) {
                    var _this = this;

                    _classCallCheck(this, Navigation);

                    this.videoContainer = videoContainer;
                    this.buttons = [];
                    this.btnArea = new RODIN.Element({
                        name: 'buttonArea',
                        width: 0.6,
                        height: 0.2,
                        background: {
                            opacity: 0.7,
                            color: '0x008BF2'
                        },
                        border: {
                            radius: 0.2
                        }
                    });
                    this.btnArea.visible = false;
                    this.isNavigationOpen = false;
                    this.btnArea.on(RODIN.CONST.READY, function (e) {
                        RODIN.Scene.add(e.target);
                        _this.viewChange = new RODIN.Text({ text: 'CHANGE VIEW', fontSize: 0.04, color: 0xFFFFFF });
                        _this.viewChange.name = 'textChange';
                        _this.viewChange._threeObject.material.visible = false;
                        _this.viewChange.on(RODIN.CONST.READY, function () {
                            e.target.add(_this.viewChange);
                            _this.viewChange.position.y = 0.135;
                        });
                        e.target._threeObject.renderOrder = 0;
                        e.target.position.z = -2;
                        e.target.position.y = 1.1;

                        var _loop = function _loop(i) {
                            var button = new Button(.2, .2, Icons[i].name, Icons[i].path);
                            _this.buttons.push(button);
                            button.active.on(RODIN.CONST.READY, function (evt) {
                                var btn = evt.target;
                                _this.btnArea.add(btn);
                                btn.position.z = 0.02;
                                btn.position.x = -0.2 + 0.2 * i;
                                var type = new RODIN.Text({ text: evt.target.name, fontSize: 0.04, color: 0xFFFFFF });

                                type.name = 'hoverText';
                                type.on(RODIN.CONST.READY, function (t) {
                                    _this.btnArea.visible = true;
                                    button.active.add(type);
                                    t.target.position.y = -0.13;
                                    t.target._threeObject.material.visible = false;
                                });
                                btn.on(RODIN.CONST.GAMEPAD_BUTTON_UP, function (e) {
                                    _this.openNavigation(e);
                                });
                                btn.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, function (e) {
                                    _this.onButtonDown(e);
                                });
                                _this.setActiveButton('Linear');
                            });
                            button.active.on(RODIN.CONST.GAMEPAD_HOVER, _this.onHoverAnimation.bind(_this));
                            button.active.on(RODIN.CONST.GAMEPAD_HOVER_OUT, _this.onHoverOutAnimation.bind(_this));
                        };

                        for (var i = 0; i < 3; i++) {
                            _loop(i);
                        }
                    });
                }

                _createClass(Navigation, [{
                    key: 'onButtonDown',
                    value: function onButtonDown(e) {
                        e.stopPropagation();
                        this._lastButtonDown = RODIN.Time.now;
                    }
                }, {
                    key: 'hideOrShowChangeView',
                    value: function hideOrShowChangeView() {
                        this.sculpt._threeObject.material.visible = !this.sculpt._threeObject.material.visible;
                    }
                }, {
                    key: 'setActiveButton',
                    value: function setActiveButton(type) {
                        this.hideViewChange();
                        this.hideOrShowChangeView();
                        this.buttons.map(function (btn) {
                            Navigation.animation(btn.element, {
                                position: {
                                    x: 0
                                }
                            }, 'navigationClose', 300);
                            btn.element.on(RODIN.CONST.ANIMATION_COMPLETE, function (e) {
                                if (e.animation === 'navigationClose') {
                                    btn.element._threeObject.material.visible = btn.element.name.toLowerCase() === type.toLowerCase();
                                    btn.element._threeObject.visible = btn.element.name.toLowerCase() === type.toLowerCase();
                                }
                            });
                        });
                        this.isNavigationOpen = false;
                        this.videoContainer.setView(type);
                    }
                }, {
                    key: 'onHoverAnimation',
                    value: function onHoverAnimation(evt) {
                        var target = evt.target;

                        Navigation.animation(target._children[1], { scale: { x: .95, y: .95, z: .95 } }, 'scaleIn', 300);
                        if (!this.isNavigationOpen) {
                            this.showViewChange();
                        }
                        target._children.map(function (ch) {
                            if (ch.name === 'hoverText') {
                                ch._threeObject.material.visible = true;
                            }
                        });
                    }
                }, {
                    key: 'onHoverOutAnimation',
                    value: function onHoverOutAnimation(evt) {
                        var target = evt.target;

                        Navigation.animation(target._children[1], { scale: { x: .8, y: .8, z: .8 } }, 'scaleOut', 300);
                        if (!this.isNavigationOpen) {
                            this.hideViewChange();
                        }
                        target._children.map(function (ch) {
                            if (ch.name === 'hoverText') {
                                ch._threeObject.material.visible = false;
                            }
                        });
                    }
                }, {
                    key: 'openNavigation',
                    value: function openNavigation(evt) {
                        evt.stopPropagation();
                        if (RODIN.Time.now - this._lastButtonDown > 200 || RODIN.Time.now - this._lastButtonDown < 50) return;
                        if (evt.target.animation.isPlaying()) {
                            return;
                        }
                        if (this.sculpt._threeObject.material.visible) {
                            return this.setActiveButton(evt.target.name);
                        }
                        this.showNavigation();
                        this.showViewChange();
                        this.buttons.map(function (value, key) {
                            value.element._threeObject.material.visible = false;
                            value.element._threeObject.visible = true;
                            Navigation.animation(value.element, {
                                position: {
                                    x: -0.20 + 0.20 * key
                                }
                            }, 'navigationOpen', 300);
                            if (value.element.animation && value.element.animation.isPlaying('navigationOpen')) {
                                value.element.animation.stop('navigationOpen', false);
                                console.log('aab');
                            }
                        });
                    }
                }, {
                    key: 'showNavigation',
                    value: function showNavigation() {
                        this.isNavigationOpen = true;
                        this.sculpt._threeObject.material.visible = true;
                    }
                }, {
                    key: 'hideViewChange',
                    value: function hideViewChange() {
                        this.viewChange._threeObject.material.visible = false;
                    }
                }, {
                    key: 'showViewChange',
                    value: function showViewChange() {
                        this.viewChange._threeObject.material.visible = true;
                    }
                }, {
                    key: 'sculpt',
                    get: function get() {
                        return this.btnArea;
                    }
                }], [{
                    key: 'animation',
                    value: function animation(obj, params, name, duration) {
                        var navigationAnimation = new RODIN.AnimationClip(name, params);
                        navigationAnimation.duration(duration);
                        obj.animation.add(navigationAnimation);
                        obj.animation.start(name);
                    }
                }]);

                return Navigation;
            }());

            _export('Navigation', Navigation);
        }
    };
});