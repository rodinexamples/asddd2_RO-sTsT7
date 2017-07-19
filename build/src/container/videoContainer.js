'use strict';

System.register(['rodin/core', '../data/videos.js', '../components/Thumbnail.js', '../components/Gallery.js', './videoPlayerConatainer.js'], function (_export, _context) {
    "use strict";

    var RODIN, videos, Thumbnail, linearView, cylindricalView, gridView, VideoPlayer, _createClass, VideoContainer;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_rodinCore) {
            RODIN = _rodinCore;
        }, function (_dataVideosJs) {
            videos = _dataVideosJs.videos;
        }, function (_componentsThumbnailJs) {
            Thumbnail = _componentsThumbnailJs.Thumbnail;
        }, function (_componentsGalleryJs) {
            linearView = _componentsGalleryJs.linearView;
            cylindricalView = _componentsGalleryJs.cylindricalView;
            gridView = _componentsGalleryJs.gridView;
        }, function (_videoPlayerConatainerJs) {
            VideoPlayer = _videoPlayerConatainerJs.VideoPlayer;
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

            _export('VideoContainer', VideoContainer = function () {
                function VideoContainer(blinkAnimation) {
                    var _this = this;

                    _classCallCheck(this, VideoContainer);

                    this.blinkAnimation = blinkAnimation;
                    this.videoPlayer = new VideoPlayer();
                    this.thumbs = videos.map(function (v) {
                        return new Thumbnail(v, _this.videoPlayer, _this.blinkAnimation);
                    });
                    this.standingArea = new RODIN.Plane(8, 8, new THREE.MeshBasicMaterial({
                        transparent: true,
                        map: RODIN.Loader.loadTexture('./src/assets/floor1.png')
                    }));
                    this.standingArea.on(RODIN.CONST.READY, function (evt) {
                        RODIN.Scene.add(_this.standingArea);
                        evt.target.position.z = -.3;
                        evt.target.position.y = -1;
                        evt.target.rotation.x = -Math.PI / 2;
                    });
                }

                _createClass(VideoContainer, [{
                    key: 'setView',
                    value: function setView() {
                        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'linear';

                        type = type.toLowerCase();
                        switch (type) {
                            case 'linear':
                                linearView(this.thumbs);
                                break;
                            case 'flat':
                                gridView(this.thumbs);
                                break;
                            case 'cylinder':
                                cylindricalView(this.thumbs);
                                break;
                            default:
                                linearView(this.thumbs);
                        }
                    }
                }]);

                return VideoContainer;
            }());

            _export('VideoContainer', VideoContainer);
        }
    };
});