/**
 * @author mrdoob / http://mrdoob.com/
 */

import { PerspectiveCamera } from "./PerspectiveCamera.js";

// 阵列相机，利用多个光学系统和多个图像传感器组成，大幅降低模组厚度，
// 拍摄后通过算法合成数据形成图像。
// 目前手机厂商使用阵列相机来减少手机厚度，毕竟传统的相机要得到高分辨率就得大焦距

function ArrayCamera(array) {
  PerspectiveCamera.call(this);

  this.cameras = array || [];
}

ArrayCamera.prototype = Object.assign(
  Object.create(PerspectiveCamera.prototype),
  {
    constructor: ArrayCamera,

    isArrayCamera: true
  }
);

export { ArrayCamera };
