/**
 * @author mrdoob / http://mrdoob.com/
 */

import { Texture } from "./Texture.js";

/**
 * 在模型表面基于视频贴图
 * @param {*} video 视频源
 * @param {*} mapping
 * @param {*} wrapS ST坐标系贴图
 * @param {*} wrapT
 * @param {*} magFilter 过滤器
 * @param {*} minFilter
 * @param {*} format 文件格式
 * @param {*} type
 * @param {*} anisotropy 是否各向异性
 */
function VideoTexture(
  video,
  mapping,
  wrapS,
  wrapT,
  magFilter,
  minFilter,
  format,
  type,
  anisotropy
) {
  Texture.call(
    this,
    video,
    mapping,
    wrapS,
    wrapT,
    magFilter,
    minFilter,
    format,
    type,
    anisotropy
  );

  this.generateMipmaps = false;
}

VideoTexture.prototype = Object.assign(Object.create(Texture.prototype), {
  constructor: VideoTexture,

  isVideoTexture: true,

  update: function() {
    var video = this.image;

    // 当视频播放完毕，则重制贴图进行循环播放
    if (video.readyState >= video.HAVE_CURRENT_DATA) {
      this.needsUpdate = true;
    }
  }
});

export { VideoTexture };
