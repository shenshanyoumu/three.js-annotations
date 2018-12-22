import { InterleavedBuffer } from "./InterleavedBuffer.js";

// 实例化的交叉存储buffer
function InstancedInterleavedBuffer(array, stride, meshPerAttribute) {
  InterleavedBuffer.call(this, array, stride);

  this.meshPerAttribute = meshPerAttribute || 1;
}

InstancedInterleavedBuffer.prototype = Object.assign(
  Object.create(InterleavedBuffer.prototype),
  {
    constructor: InstancedInterleavedBuffer,

    isInstancedInterleavedBuffer: true,

    copy: function(source) {
      InterleavedBuffer.prototype.copy.call(this, source);

      this.meshPerAttribute = source.meshPerAttribute;

      return this;
    }
  }
);

export { InstancedInterleavedBuffer };
