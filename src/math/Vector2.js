//  二维向量
function Vector2(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

// 二维向量原型对象具有width/height属性；
Object.defineProperties(Vector2.prototype, {
  width: {
    get: function() {
      return this.x;
    },

    set: function(value) {
      this.x = value;
    }
  },

  height: {
    get: function() {
      return this.y;
    },

    set: function(value) {
      this.y = value;
    }
  }
});

Object.assign(Vector2.prototype, {
  isVector2: true,

  set: function(x, y) {
    this.x = x;
    this.y = y;

    return this;
  },

  // 标量
  setScalar: function(scalar) {
    this.x = scalar;
    this.y = scalar;

    return this;
  },

  setX: function(x) {
    this.x = x;

    return this;
  },

  setY: function(y) {
    this.y = y;

    return this;
  },

  // 二维向量的单一维度设置
  setComponent: function(index, value) {
    switch (index) {
      case 0:
        this.x = value;
        break;
      case 1:
        this.y = value;
        break;
      default:
        throw new Error("index is out of range: " + index);
    }

    return this;
  },

  // 二维向量的分量
  getComponent: function(index) {
    switch (index) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      default:
        throw new Error("index is out of range: " + index);
    }
  },

  // 调用Vector2的构造函数返回新对象
  clone: function() {
    return new this.constructor(this.x, this.y);
  },

  copy: function(v) {
    this.x = v.x;
    this.y = v.y;

    return this;
  },

  add: function(v, w) {
    if (w !== undefined) {
      console.warn(
        "THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead."
      );
      return this.addVectors(v, w);
    }

    this.x += v.x;
    this.y += v.y;

    return this;
  },

  //   分量增加一个标量值
  addScalar: function(s) {
    this.x += s;
    this.y += s;

    return this;
  },

  //两个向量的加法，返回结果
  addVectors: function(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;

    return this;
  },

  addScaledVector: function(v, s) {
    this.x += v.x * s;
    this.y += v.y * s;

    return this;
  },

  // 向量减法
  sub: function(v, w) {
    if (w !== undefined) {
      console.warn(
        "THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead."
      );
      return this.subVectors(v, w);
    }

    this.x -= v.x;
    this.y -= v.y;

    return this;
  },

  subScalar: function(s) {
    this.x -= s;
    this.y -= s;

    return this;
  },

  // 两向量相减
  subVectors: function(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;

    return this;
  },

  multiply: function(v) {
    this.x *= v.x;
    this.y *= v.y;

    return this;
  },

  // 向量分量乘以比例尺
  multiplyScalar: function(scalar) {
    this.x *= scalar;
    this.y *= scalar;

    return this;
  },

  divide: function(v) {
    this.x /= v.x;
    this.y /= v.y;

    return this;
  },

  // 除以比例尺，等于乘以比例尺的倒数
  divideScalar: function(scalar) {
    return this.multiplyScalar(1 / scalar);
  },

  // 下面这个矩阵与向量的乘法关系
  applyMatrix3: function(m) {
    var x = this.x,
      y = this.y;
    var e = m.elements;

    this.x = e[0] * x + e[3] * y + e[6];
    this.y = e[1] * x + e[4] * y + e[7];

    return this;
  },

  min: function(v) {
    this.x = Math.min(this.x, v.x);
    this.y = Math.min(this.y, v.y);

    return this;
  },

  max: function(v) {
    this.x = Math.max(this.x, v.x);
    this.y = Math.max(this.y, v.y);

    return this;
  },

  // 夹逼方法，得到min/max/this三个坐标点的“中间”点。
  clamp: function(min, max) {
    this.x = Math.max(min.x, Math.min(max.x, this.x));
    this.y = Math.max(min.y, Math.min(max.y, this.y));

    return this;
  },

  clampScalar: (function() {
    var min = new Vector2();
    var max = new Vector2();

    // 注意具名函数clampScalar与对象的clapSScalar方法是不一样的
    return function clampScalar(minVal, maxVal) {
      min.set(minVal, minVal);
      max.set(maxVal, maxVal);

      return this.clamp(min, max);
    };
  })(),

  // 对于给定的区间[min,max]，求得向量本身的比例长度
  clampLength: function(min, max) {
    var length = this.length();

    return this.divideScalar(length || 1).multiplyScalar(
      Math.max(min, Math.min(max, length))
    );
  },

  floor: function() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);

    return this;
  },

  ceil: function() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);

    return this;
  },

  // 向量分量的四舍五入
  round: function() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);

    return this;
  },

  // 向量收缩
  roundToZero: function() {
    this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);
    this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);

    return this;
  },
  // 向量求反
  negate: function() {
    this.x = -this.x;
    this.y = -this.y;

    return this;
  },

  // 向量内积
  dot: function(v) {
    return this.x * v.x + this.y * v.y;
  },

  // 向量范数的平方
  lengthSq: function() {
    return this.x * this.x + this.y * this.y;
  },

  // 向量的范数
  length: function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },

  // 向量的曼哈顿长度，在A*算法中路径搜索采用曼哈顿长度
  manhattanLength: function() {
    return Math.abs(this.x) + Math.abs(this.y);
  },

  // 向量归一化处理
  normalize: function() {
    return this.divideScalar(this.length() || 1);
  },

  // 向量夹角
  angle: function() {
    // computes the angle in radians with respect to the positive x-axis

    var angle = Math.atan2(this.y, this.x);

    if (angle < 0) angle += 2 * Math.PI;

    return angle;
  },

  // 两个向量的距离
  distanceTo: function(v) {
    return Math.sqrt(this.distanceToSquared(v));
  },

  // 两个向量的距离平方
  distanceToSquared: function(v) {
    var dx = this.x - v.x,
      dy = this.y - v.y;
    return dx * dx + dy * dy;
  },

  // 两个向量的曼哈顿距离
  manhattanDistanceTo: function(v) {
    return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
  },

  // 向量归一化后，再进行范数设置
  setLength: function(length) {
    return this.normalize().multiplyScalar(length);
  },

  // 具有比例因子的线性插值
  lerp: function(v, alpha) {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;

    return this;
  },

  // 两个向量之间的alpha比例插值
  lerpVectors: function(v1, v2, alpha) {
    return this.subVectors(v2, v1)
      .multiplyScalar(alpha)
      .add(v1);
  },

  // 向量比较
  equals: function(v) {
    return v.x === this.x && v.y === this.y;
  },

  // 从一个数组得到向量值
  fromArray: function(array, offset) {
    if (offset === undefined) offset = 0;

    this.x = array[offset];
    this.y = array[offset + 1];

    return this;
  },

  // 将向量返回到数组
  toArray: function(array, offset) {
    if (array === undefined) array = [];
    if (offset === undefined) offset = 0;

    array[offset] = this.x;
    array[offset + 1] = this.y;

    return array;
  },

  // attribute是一个缓冲对象
  fromBufferAttribute: function(attribute, index, offset) {
    if (offset !== undefined) {
      console.warn(
        "THREE.Vector2: offset has been removed from .fromBufferAttribute()."
      );
    }

    this.x = attribute.getX(index);
    this.y = attribute.getY(index);

    return this;
  },

  // 向量以center为中心，angle为角度的旋转
  rotateAround: function(center, angle) {
    var c = Math.cos(angle),
      s = Math.sin(angle);

    var x = this.x - center.x;
    var y = this.y - center.y;

    this.x = x * c - y * s + center.x;
    this.y = x * s + y * c + center.y;

    return this;
  }
});

export { Vector2 };
