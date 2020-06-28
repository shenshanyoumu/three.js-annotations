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
 * @param {*} magFilter magnify filter，即将小纹理图映射到大尺寸表面
 * @param {*} minFilter 将大尺寸纹理图映射到小尺寸模型表面
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

    // magnify-即将小纹理图贴在大表面上，存在映射插值
    magFilter,
    // minify-即将大纹理图贴在小表面上，存在纹理采样
    minFilter,
    format,
    type,

    // 如果纹理对象存在各向异性，则可以沿着
    // 高纹理像素密度采样，以至于贴图不模糊
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
