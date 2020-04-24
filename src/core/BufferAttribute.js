import { Vector4 } from "../math/Vector4.js";
import { Vector3 } from "../math/Vector3.js";
import { Vector2 } from "../math/Vector2.js";
import { Color } from "../math/Color.js";

/**
 * 模型属性缓冲对象,webgl中顶点着色器中attribute修饰的变量一般从缓冲区取值
 * @param {*} array typedArray，一般为buffer对象
 * @param {*} itemSize 每个属性需要的字节数
 * @param {*} normalized 属性值是否归一化处理
 */
function BufferAttribute(array, itemSize, normalized) {
  // array必须是TypedArray，目前ES6语言层面支持TypedArray
  // 而Node实现的buffer类，可以在视图层实现TypedArray
  if (Array.isArray(array)) {
    throw new TypeError(
      "THREE.BufferAttribute: array should be a Typed Array."
    );
  }
  
  //缓冲对象名称
  this.name = "";
  
  //array是一个TypedArray，注意TypedArray底层基于buffer对象。
  this.array = array;

  // 场景中不同属性变量的类型不一样，因此需要的字节数不一样。
  // 注意属性变量值由vector构成，vector每个分量的类型等同于array的声明类型
  this.itemSize = itemSize;

  // 计算属性变量个数，比如webgl中顶点着色器计算顶点个数
  this.count = array !== undefined ? array.length / itemSize : 0;
  this.normalized = normalized === true;

  this.dynamic = false;
  this.updateRange = { offset: 0, count: -1 };

  this.version = 0;
}

Object.defineProperty(BufferAttribute.prototype, "needsUpdate", {
  set: function(value) {
    if (value === true) this.version++;
  }
});

Object.assign(BufferAttribute.prototype, {
  isBufferAttribute: true,

  onUploadCallback: function() {},

  setArray: function(array) {
    if (Array.isArray(array)) {
      throw new TypeError(
        "THREE.BufferAttribute: array should be a Typed Array."
      );
    }

    // array.length
    this.count = array !== undefined ? array.length / this.itemSize : 0;
    this.array = array;
  },

  setDynamic: function(value) {
    this.dynamic = value;

    return this;
  },

  copy: function(source) {
    this.array = new source.array.constructor(source.array);
    this.itemSize = source.itemSize;
    this.count = source.count;
    this.normalized = source.normalized;

    this.dynamic = source.dynamic;

    return this;
  },

  copyAt: function(index1, attribute, index2) {
    index1 *= this.itemSize;
    index2 *= attribute.itemSize;

    for (var i = 0, l = this.itemSize; i < l; i++) {
      this.array[index1 + i] = attribute.array[index2 + i];
    }

    return this;
  },

  copyArray: function(array) {
    this.array.set(array);

    return this;
  },

  copyColorsArray: function(colors) {
    var array = this.array,
      offset = 0;

    for (var i = 0, l = colors.length; i < l; i++) {
      var color = colors[i];

      if (color === undefined) {
        console.warn(
          "THREE.BufferAttribute.copyColorsArray(): color is undefined",
          i
        );
        color = new Color();
      }

      array[offset++] = color.r;
      array[offset++] = color.g;
      array[offset++] = color.b;
    }

    return this;
  },

  copyVector2sArray: function(vectors) {
    var array = this.array,
      offset = 0;

    for (var i = 0, l = vectors.length; i < l; i++) {
      var vector = vectors[i];

      if (vector === undefined) {
        console.warn(
          "THREE.BufferAttribute.copyVector2sArray(): vector is undefined",
          i
        );
        vector = new Vector2();
      }

      array[offset++] = vector.x;
      array[offset++] = vector.y;
    }

    return this;
  },

  copyVector3sArray: function(vectors) {
    var array = this.array,
      offset = 0;

    for (var i = 0, l = vectors.length; i < l; i++) {
      var vector = vectors[i];

      if (vector === undefined) {
        console.warn(
          "THREE.BufferAttribute.copyVector3sArray(): vector is undefined",
          i
        );
        vector = new Vector3();
      }

      array[offset++] = vector.x;
      array[offset++] = vector.y;
      array[offset++] = vector.z;
    }

    return this;
  },

  copyVector4sArray: function(vectors) {
    var array = this.array,
      offset = 0;

    for (var i = 0, l = vectors.length; i < l; i++) {
      var vector = vectors[i];

      if (vector === undefined) {
        console.warn(
          "THREE.BufferAttribute.copyVector4sArray(): vector is undefined",
          i
        );
        vector = new Vector4();
      }

      array[offset++] = vector.x;
      array[offset++] = vector.y;
      array[offset++] = vector.z;
      array[offset++] = vector.w;
    }

    return this;
  },

  // 在TypedArray的一切操作都会映射到底层buffer对象，offset作为偏移量
  set: function(value, offset) {
    if (offset === undefined) offset = 0;

    this.array.set(value, offset);

    return this;
  },

  // 每一个属性变量值由vector组成，vector中每个分量类型等价于TypedArray的类型
  getX: function(index) {
    return this.array[index * this.itemSize];
  },

  setX: function(index, x) {
    this.array[index * this.itemSize] = x;

    return this;
  },

  getY: function(index) {
    return this.array[index * this.itemSize + 1];
  },

  setY: function(index, y) {
    this.array[index * this.itemSize + 1] = y;

    return this;
  },

  getZ: function(index) {
    return this.array[index * this.itemSize + 2];
  },

  setZ: function(index, z) {
    this.array[index * this.itemSize + 2] = z;

    return this;
  },

  getW: function(index) {
    return this.array[index * this.itemSize + 3];
  },

  setW: function(index, w) {
    this.array[index * this.itemSize + 3] = w;

    return this;
  },

  setXY: function(index, x, y) {
    index *= this.itemSize;

    this.array[index + 0] = x;
    this.array[index + 1] = y;

    return this;
  },

  setXYZ: function(index, x, y, z) {
    index *= this.itemSize;

    this.array[index + 0] = x;
    this.array[index + 1] = y;
    this.array[index + 2] = z;

    return this;
  },

  setXYZW: function(index, x, y, z, w) {
    index *= this.itemSize;

    this.array[index + 0] = x;
    this.array[index + 1] = y;
    this.array[index + 2] = z;
    this.array[index + 3] = w;

    return this;
  },

  onUpload: function(callback) {
    this.onUploadCallback = callback;

    return this;
  },

  clone: function() {
    return new this.constructor(this.array, this.itemSize).copy(this);
  }
});

//创建8位Int类型的数组视图
function Int8BufferAttribute(array, itemSize, normalized) {
  BufferAttribute.call(this, new Int8Array(array), itemSize, normalized);
}

Int8BufferAttribute.prototype = Object.create(BufferAttribute.prototype);
Int8BufferAttribute.prototype.constructor = Int8BufferAttribute;

function Uint8BufferAttribute(array, itemSize, normalized) {
  BufferAttribute.call(this, new Uint8Array(array), itemSize, normalized);
}

Uint8BufferAttribute.prototype = Object.create(BufferAttribute.prototype);
Uint8BufferAttribute.prototype.constructor = Uint8BufferAttribute;

function Uint8ClampedBufferAttribute(array, itemSize, normalized) {
  BufferAttribute.call(
    this,
    new Uint8ClampedArray(array),
    itemSize,
    normalized
  );
}

// 各种类型的TypedArray，不同类型所代表的属性字节数也是不一样
Uint8ClampedBufferAttribute.prototype = Object.create(
  BufferAttribute.prototype
);
Uint8ClampedBufferAttribute.prototype.constructor = Uint8ClampedBufferAttribute;

function Int16BufferAttribute(array, itemSize, normalized) {
  BufferAttribute.call(this, new Int16Array(array), itemSize, normalized);
}

Int16BufferAttribute.prototype = Object.create(BufferAttribute.prototype);
Int16BufferAttribute.prototype.constructor = Int16BufferAttribute;

function Uint16BufferAttribute(array, itemSize, normalized) {
  BufferAttribute.call(this, new Uint16Array(array), itemSize, normalized);
}

Uint16BufferAttribute.prototype = Object.create(BufferAttribute.prototype);
Uint16BufferAttribute.prototype.constructor = Uint16BufferAttribute;

function Int32BufferAttribute(array, itemSize, normalized) {
  BufferAttribute.call(this, new Int32Array(array), itemSize, normalized);
}

Int32BufferAttribute.prototype = Object.create(BufferAttribute.prototype);
Int32BufferAttribute.prototype.constructor = Int32BufferAttribute;

function Uint32BufferAttribute(array, itemSize, normalized) {
  BufferAttribute.call(this, new Uint32Array(array), itemSize, normalized);
}

Uint32BufferAttribute.prototype = Object.create(BufferAttribute.prototype);
Uint32BufferAttribute.prototype.constructor = Uint32BufferAttribute;

function Float32BufferAttribute(array, itemSize, normalized) {
  BufferAttribute.call(this, new Float32Array(array), itemSize, normalized);
}

Float32BufferAttribute.prototype = Object.create(BufferAttribute.prototype);
Float32BufferAttribute.prototype.constructor = Float32BufferAttribute;

function Float64BufferAttribute(array, itemSize, normalized) {
  BufferAttribute.call(this, new Float64Array(array), itemSize, normalized);
}

Float64BufferAttribute.prototype = Object.create(BufferAttribute.prototype);
Float64BufferAttribute.prototype.constructor = Float64BufferAttribute;

//
export {
  Float64BufferAttribute,
  Float32BufferAttribute,
  Uint32BufferAttribute,
  Int32BufferAttribute,
  Uint16BufferAttribute,
  Int16BufferAttribute,
  Uint8ClampedBufferAttribute,
  Uint8BufferAttribute,
  Int8BufferAttribute,
  BufferAttribute
};
