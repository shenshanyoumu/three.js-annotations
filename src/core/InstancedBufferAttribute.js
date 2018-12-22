import { BufferAttribute } from "./BufferAttribute.js";

// 实例化的具有缓存结构的属性对象
function InstancedBufferAttribute(array, itemSize, meshPerAttribute) {
  BufferAttribute.call(this, array, itemSize);

  this.meshPerAttribute = meshPerAttribute || 1;
}

InstancedBufferAttribute.prototype = Object.assign(
  Object.create(BufferAttribute.prototype),
  {
    constructor: InstancedBufferAttribute,

    isInstancedBufferAttribute: true,

    copy: function(source) {
      BufferAttribute.prototype.copy.call(this, source);

      this.meshPerAttribute = source.meshPerAttribute;

      return this;
    }
  }
);

export { InstancedBufferAttribute };
