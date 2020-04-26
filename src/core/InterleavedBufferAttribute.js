//  数据存储结构。Interleaved交叉buffer；
// 在WebGL中基于缓冲区的interleaved技术可以同时存储坐标和颜色的属性
function InterleavedBufferAttribute(
  interleavedBuffer,
  itemSize,
  offset,
  normalized
) {
  this.data = interleavedBuffer;
  this.itemSize = itemSize;
  this.offset = offset;

  this.normalized = normalized === true;
}

Object.defineProperties(InterleavedBufferAttribute.prototype, {
  count: {
    get: function() {
      return this.data.count;
    }
  },

  array: {
    get: function() {
      return this.data.array;
    }
  }
});

Object.assign(InterleavedBufferAttribute.prototype, {
  isInterleavedBufferAttribute: true,

  // 步长与偏移量共同决定从interleaved缓冲数组中特定位置进行取值
  setX: function(index, x) {
    this.data.array[index * this.data.stride + this.offset] = x;

    return this;
  },

  setY: function(index, y) {
    this.data.array[index * this.data.stride + this.offset + 1] = y;

    return this;
  },

  setZ: function(index, z) {
    this.data.array[index * this.data.stride + this.offset + 2] = z;

    return this;
  },

  setW: function(index, w) {
    this.data.array[index * this.data.stride + this.offset + 3] = w;

    return this;
  },

  getX: function(index) {
    return this.data.array[index * this.data.stride + this.offset];
  },

  getY: function(index) {
    return this.data.array[index * this.data.stride + this.offset + 1];
  },

  getZ: function(index) {
    return this.data.array[index * this.data.stride + this.offset + 2];
  },

  getW: function(index) {
    return this.data.array[index * this.data.stride + this.offset + 3];
  },

  setXY: function(index, x, y) {
    index = index * this.data.stride + this.offset;

    this.data.array[index + 0] = x;
    this.data.array[index + 1] = y;

    return this;
  },

  setXYZ: function(index, x, y, z) {
    index = index * this.data.stride + this.offset;

    this.data.array[index + 0] = x;
    this.data.array[index + 1] = y;
    this.data.array[index + 2] = z;

    return this;
  },

  setXYZW: function(index, x, y, z, w) {
    index = index * this.data.stride + this.offset;

    this.data.array[index + 0] = x;
    this.data.array[index + 1] = y;
    this.data.array[index + 2] = z;
    this.data.array[index + 3] = w;

    return this;
  }
});

export { InterleavedBufferAttribute };
