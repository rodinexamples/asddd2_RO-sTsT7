'use strict';

System.register(['rodin/core'], function (_export, _context) {
    "use strict";

    var RODIN, _createClass, Thumbnail;

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

            _export('Thumbnail', Thumbnail = function (_RODIN$Sculpt) {
                _inherits(Thumbnail, _RODIN$Sculpt);

                function Thumbnail(params, videoPlayer, blinkAnimation) {
                    _classCallCheck(this, Thumbnail);

                    var _this = _possibleConstructorReturn(this, (Thumbnail.__proto__ || Object.getPrototypeOf(Thumbnail)).call(this));

                    _this.videoPlayer = videoPlayer;
                    _this.transition = blinkAnimation;
                    _this.element = null;
                    _this.main = null;
                    _this.params = params;
                    _this.more = new RODIN.Element({
                        width: 1.6,
                        height: 0.15,
                        background: {
                            image: { url: './src/assets/more_bg.png' }
                        },
                        border: {
                            radius: { leftBottom: 0.05, rightBottom: 0.05 }
                        },
                        transparent: true
                    });
                    _this.isDescriptionMode = false;
                    _this.more.name = 'more';
                    _this.more.visible = false;

                    _this.active = false;
                    var moretext = new RODIN.Text({
                        text: 'More About Video',
                        fontSize: 0.065,
                        color: 0xffffff
                    });
                    _this.more.on(RODIN.CONST.READY, function (evt) {
                        var more = evt.target;
                        more.visible = false;
                        more.add(moretext);
                        moretext.position.z = 0.01;
                        more._threeObject.geometry.center();
                        more.on(RODIN.CONST.GAMEPAD_HOVER, Thumbnail.moreHover.bind(_this));
                        more.on(RODIN.CONST.GAMEPAD_HOVER_OUT, Thumbnail.moreHoverOut.bind(_this));
                        more.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, _this.showHideDescription.bind(_this));
                        more.position.y = -0.38;
                        more.position.z = 0.01;
                    });
                    return _this;
                }

                /**
                 * hover animation for more
                 * @param evt
                 */


                _createClass(Thumbnail, [{
                    key: 'draw',
                    value: function draw(id) {
                        var _this2 = this;

                        this.element = new RODIN.Element({
                            name: this.params.name,
                            width: 1.6,
                            height: 0.9,
                            background: {
                                image: { url: this.params.thumbnail }
                            },
                            border: {
                                radius: 0.05
                            },
                            transparent: false
                        });
                        this.element.id = id;
                        this.id = id;

                        this.element.on(RODIN.CONST.READY, function (el) {
                            _this2.add(_this2.element);
                            _this2.element.container = _this2;

                            _this2.element.add(_this2.getDescription(id));
                            var title = new RODIN.Element({
                                width: 1.6,
                                height: 0.3,
                                background: {
                                    image: { url: './src/assets/title.png' }
                                },
                                border: {
                                    radius: { leftTop: 0.05, rightTop: 0.05 }
                                },
                                label: { text: _this2.params.title, fontSize: 0.12, color: 0xffffff, position: { v: 50, h: 0 } }
                            });
                            title.on(RODIN.CONST.READY, function (text) {
                                var target = text.target;

                                target.position.y = 0.3;
                                target.position.z = 0.01;
                                el.target.add(target);
                                el.target.add(_this2.more);
                            });
                        });
                        this._lastButtonDown = 0;

                        this.element.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, this.onButtonDown.bind(this));
                        this.element.on(RODIN.CONST.GAMEPAD_BUTTON_UP, this.onButtonUp.bind(this));
                        this.element.on(RODIN.CONST.GAMEPAD_HOVER, this.onElementHover.bind(this));
                        this.element.on(RODIN.CONST.GAMEPAD_HOVER_OUT, this.onElementHoverOut.bind(this));
                        this.element.on(RODIN.CONST.GAMEPAD_MOVE, Thumbnail.onButtonMove.bind(this));
                        return this;
                    }
                }, {
                    key: 'onElementHover',
                    value: function onElementHover(e) {
                        if (!this.active) {
                            this.more.visible = true;
                            Thumbnail.reset(e.target.container.parent);
                            Thumbnail.thumbAnimation(e.target, { position: { z: .05 } }, 'elementShow', 100);
                            this.active = true;
                        }
                    }
                }, {
                    key: 'onElementHoverOut',
                    value: function onElementHoverOut(e) {
                        if (!this.description.visible) {
                            Thumbnail.reset(e.target.container.parent);
                        }
                    }
                }, {
                    key: 'onButtonDown',
                    value: function onButtonDown(e) {
                        this._lastButtonDown = RODIN.Time.now;
                    }
                }, {
                    key: 'onButtonUp',
                    value: function onButtonUp(e) {
                        var _this3 = this;

                        if (RODIN.Time.now - this._lastButtonDown > 200) return;
                        if (!this.description._threeObject.visible) {
                            this.transition.camera = RODIN.Scene.HMDCamera;
                            this.transition.close();

                            var onclose = function onclose(evt) {
                                _this3.transition.removeEventListener('Closed', onclose);
                                RODIN.Scene.go('videoPlayerScene');
                                RODIN.Scene.HMDCamera.name = 'videoCamera';
                                _this3.videoPlayer.playVideo(_this3.params.url, _this3.params.title, './src/assets/icons/rodin.jpg', _this3.transition);
                                _this3.transition.camera = RODIN.Scene.HMDCamera;
                                // we need this timeout because of a bug in lib
                                // remove this when lib is fixed
                                setTimeout(function () {
                                    _this3.transition.open();
                                }, 0);
                            };

                            this.transition.on('Closed', onclose);
                        }
                    }
                }, {
                    key: 'getDescription',
                    value: function getDescription(id) {
                        var _this4 = this;

                        this.description = new RODIN.Element({
                            name: 'description',
                            width: 1.6,
                            height: 0.9,
                            background: {
                                opacity: 0.5,
                                color: '0x000000'
                            },
                            border: {
                                radius: 0.05
                            }
                        });

                        this.description.visible = false;
                        this.description.id = id;
                        var description = new RODIN.DynamicText({
                            width: 1.45,
                            text: this.params.description,
                            fontSize: 0.07,
                            lineHeight: 0.1,
                            color: 0xffffff
                        });
                        description._threeObject.renderOrder = 1;
                        description.position.z = .01;
                        description.position.x = 0;
                        var close = new RODIN.Text({
                            text: 'Click To Close',
                            fontSize: 0.065,
                            color: 0xffffff
                        });
                        close._threeObject.renderOrder = 1;
                        this.description.on(RODIN.CONST.READY, function (evt) {
                            evt.target.add(description);
                            description.position.y = 0.39 - description._threeObject.geometry.parameters.height / 2;
                            evt.target.add(close);
                            close.position.y = -0.38;
                            close.position.z = .01;
                            close.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, _this4.showHideDescription.bind(_this4));
                            close.on(RODIN.CONST.GAMEPAD_HOVER, _this4.clickToCloseHover.bind(_this4));
                            close.on(RODIN.CONST.GAMEPAD_HOVER_OUT, _this4.clickToCloseHoverOut.bind(_this4));
                        });
                        return this.description;
                    }
                }, {
                    key: 'clickToCloseHover',
                    value: function clickToCloseHover(e) {
                        Thumbnail.thumbAnimation(e.target, { position: { z: 0.02 } }, 'clickToCloseHover', 50);
                    }
                }, {
                    key: 'clickToCloseHoverOut',
                    value: function clickToCloseHoverOut(e) {
                        Thumbnail.thumbAnimation(e.target, { position: { z: 0.01 } }, 'clickToCloseHoverOut', 50);
                    }
                }, {
                    key: 'showHideDescription',
                    value: function showHideDescription(evt) {
                        evt && evt.stopPropagation();
                        for (var i = 0; i < this.element._children.length; i++) {
                            var el = this.element._children[i];
                            el.visible = !el.visible;
                        }
                        if (!this.active) {
                            this.more.visible = false;
                        }
                        this.isDescriptionMode = !this.isDescriptionMode;
                    }
                }], [{
                    key: 'moreHover',
                    value: function moreHover(evt) {
                        Thumbnail.thumbAnimation(evt.target._children[0], { position: { z: 0.02 } }, 'moreHover', 50);
                    }
                }, {
                    key: 'moreHoverOut',
                    value: function moreHoverOut(evt) {
                        Thumbnail.thumbAnimation(evt.target._children[0], { position: { z: 0.01 } }, 'moreHoverOut', 50);
                    }
                }, {
                    key: 'onButtonMove',
                    value: function onButtonMove(e) {
                        e.stopPropagation();
                    }
                }, {
                    key: 'thumbAnimation',
                    value: function thumbAnimation(obj, params, name, duration) {
                        var navigationAnimation = new RODIN.AnimationClip(name, params);
                        navigationAnimation.duration(duration);
                        obj.animation.add(navigationAnimation);
                        obj.animation.start(name);
                    }
                }, {
                    key: 'reset',
                    value: function reset(thumbnailContainer) {
                        if (!thumbnailContainer) return;
                        var thumbs = void 0;
                        if (thumbnailContainer && thumbnailContainer._children) {
                            thumbs = thumbnailContainer._children;
                        } else {
                            thumbs = thumbnailContainer;
                        }
                        for (var i = 0; i < thumbs.length; i++) {
                            var ch = thumbs[i];
                            if (!ch.active) {
                                continue;
                            }
                            ch.active = false;
                            ch.more.visible = false;
                            Thumbnail.thumbAnimation(ch.element, { position: { z: 0 } }, 'elementHide', 100);
                            if (ch.isDescriptionMode) {
                                ch.showHideDescription();
                            }
                        }
                    }
                }]);

                return Thumbnail;
            }(RODIN.Sculpt));

            _export('Thumbnail', Thumbnail);
        }
    };
});