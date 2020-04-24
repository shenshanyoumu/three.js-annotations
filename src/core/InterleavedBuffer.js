/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */

// 在webgl中，为了充分利用缓存区。常常将顶点坐标数据和顶点颜色数据交叉编排进数组中
// 通过对数组元素增加偏移量来分离出顶点坐标和顶点颜色
function InterleavedBuffer(array, stride) {
  this.array = array; //字符数组，每个元素表示一个UTF-8编码的字符
  this.stride = stride; //从数组中采样的步长
  this.count = array !== undefined ? array.length / stride : 0;

  this.dynamic = false;
  this.updateRange = { offset: 0, count: -1 };

  this.version = 0;
}

Object.defineProperty(InterleavedBuffer.prototype, "needsUpdate", {
  set: function(value) {
    if (value === true) this.version++;
  }
});

Object.assign(InterleavedBuffer.prototype, {
  isInterleavedBuffer: true,

  onUploadCallback: function() {},

  setArray: function(array) {
    if (Array.isArray(array)) {
      throw new TypeError(
        "THREE.BufferAttribute: array should be a Typed Array."
      );
    }

    this.count = array !== undefined ? array.length / this.stride : 0;
    this.array = array;
  },

  setDynamic: function(value) {
    this.dynamic = value;

    return this;
  },

  copy: function(source) {
    this.array = new source.array.constructor(source.array);
    this.count = source.count;
    this.stride = source.stride;
    this.dynamic = source.dynamic;

    return this;
  },

  copyAt: function(index1, attribute, index2) {
    index1 *= this.stride;
    index2 *= attribute.stride;

    for (var i = 0, l = this.stride; i < l; i++) {
      this.array[index1 + i] = attribute.array[index2 + i];
    }

    return this;
  },

  set: function(value, offset) {
    if (offset === undefined) offset = 0;

    this.array.set(value, offset);

    return this;
  },

  clone: function() {
    return new this.constructor().copy(this);
  },

  onUpload: function(callback) {
    this.onUploadCallback = callback;

    return this;
  }
});

export { InterleavedBuffer };
