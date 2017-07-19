'use strict';

System.register(['rodin/core', '../components/vpControls.js'], function (_export, _context) {
    "use strict";

    var RODIN, VPcontrolPanel, _createClass, videoPlayerScene, VideoPlayer;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_rodinCore) {
            RODIN = _rodinCore;
        }, function (_componentsVpControlsJs) {
            VPcontrolPanel = _componentsVpControlsJs.VPcontrolPanel;
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

            RODIN.start();
            /**
             * Create a separate scene for video player
             * @type {RODIN.Scene}
             */

            _export('videoPlayerScene', videoPlayerScene = new RODIN.Scene('videoPlayerScene'));

            _export('videoPlayerScene', videoPlayerScene);

            _export('VideoPlayer', VideoPlayer = function () {
                function VideoPlayer() {
                    _classCallCheck(this, VideoPlayer);

                    this.player = new RODIN.MaterialPlayer({
                        HD: '',
                        SD: '',
                        default: 'HD'
                    }, false, 25, false, true);
                }

                /**
                 * Play a video with given parameters
                 * @param url
                 * @param title
                 * @param backgroundImage
                 * @param transition
                 */


                _createClass(VideoPlayer, [{
                    key: 'playVideo',
                    value: function playVideo(url, title, backgroundImage, transition) {
                        if (!this.controls) {
                            this.controls = new VPcontrolPanel({
                                player: this.player,
                                title: title,
                                cover: backgroundImage,
                                distance: 2,
                                width: 3
                            }, transition);
                            this.container();
                            this.player.loadVideo(url);
                        } else {
                            this.controls.loadVideo(title, url, backgroundImage, this.sphere);
                        }
                    }
                }, {
                    key: 'container',
                    value: function container() {
                        var _this = this;

                        var controlPanel = void 0,
                            material = void 0;

                        videoPlayerScene.preRender(function () {
                            _this.player.update(RODIN.Time.delta);
                        });
                        controlPanel = this.controls;
                        controlPanel.on(RODIN.CONST.READY, function (evt) {
                            videoPlayerScene.add(evt.target);
                            evt.target.position.y = 1.6;
                            if (evt.target.coverEl) {
                                evt.target.coverEl.rotation.y = -Math.PI / 2;
                            }
                        });
                        material = new THREE.MeshBasicMaterial({
                            map: this.player.getTexture()
                        });
                        this.sphere = new RODIN.Sculpt(new THREE.Mesh(new THREE.SphereBufferGeometry(90, 720, 4), material));
                        this.sphere.scale.set(1, 1, -1);
                        this.sphere.rotation.y = Math.PI / 2;
                        videoPlayerScene.add(this.sphere);
                    }
                }]);

                return VideoPlayer;
            }());

            _export('VideoPlayer', VideoPlayer);
        }
    };
});