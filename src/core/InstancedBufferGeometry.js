import { BufferGeometry } from "./BufferGeometry.js";

//实例化的具有缓冲结构的几何模型
function InstancedBufferGeometry() {
  BufferGeometry.call(this);

  this.type = "InstancedBufferGeometry";
  this.maxInstancedCount = undefined;
}

InstancedBufferGeometry.prototype = Object.assign(
  Object.create(BufferGeometry.prototype),
  {
    constructor: InstancedBufferGeometry,

    isInstancedBufferGeometry: true,

    copy: function(source) {
      BufferGeometry.prototype.copy.call(this, source);

      this.maxInstancedCount = source.maxInstancedCount;

      return this;
    },

    clone: function() {
      return new this.constructor().copy(this);
    }
  }
);

export { InstancedBufferGeometry };
