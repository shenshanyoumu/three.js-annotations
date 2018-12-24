/**
 * @author mrdoob / http://mrdoob.com/
 */

import { Vector3 } from "../math/Vector3.js";
import { Audio } from "./Audio.js";
import { Object3D } from "../core/Object3D.js";

// 音频是声音在时间轴上的函数，因此需要位置相关的类
function PositionalAudio(listener) {
  Audio.call(this, listener);

  //   相当于变换时间轴来“快进”/“后退”音频信息
  this.panner = this.context.createPanner();
  this.panner.connect(this.gain);
}

PositionalAudio.prototype = Object.assign(Object.create(Audio.prototype), {
  constructor: PositionalAudio,

  getOutput: function() {
    return this.panner;
  },

  getRefDistance: function() {
    return this.panner.refDistance;
  },

  setRefDistance: function(value) {
    this.panner.refDistance = value;
  },

  getRolloffFactor: function() {
    return this.panner.rolloffFactor;
  },

  setRolloffFactor: function(value) {
    this.panner.rolloffFactor = value;
  },

  getDistanceModel: function() {
    return this.panner.distanceModel;
  },

  setDistanceModel: function(value) {
    this.panner.distanceModel = value;
  },

  getMaxDistance: function() {
    return this.panner.maxDistance;
  },

  setMaxDistance: function(value) {
    this.panner.maxDistance = value;
  },

  //之所以需要更新音频对象在世界坐标系中的位置，其实就是为了模拟声音在空间中的传播
  updateMatrixWorld: (function() {
    var position = new Vector3();

    return function updateMatrixWorld(force) {
      Object3D.prototype.updateMatrixWorld.call(this, force);

      position.setFromMatrixPosition(this.matrixWorld);

      this.panner.setPosition(position.x, position.y, position.z);
    };
  })()
});

export { PositionalAudio };
