var _Math = {
  // 角度/弧度转换
  DEG2RAD: Math.PI / 180,
  RAD2DEG: 180 / Math.PI,

  // 立刻执行函数计算得到UUID，目前可以使用ES6的Symbol语法
  generateUUID: (function() {
    var lut = [];

    for (var i = 0; i < 256; i++) {
      lut[i] = (i < 16 ? "0" : "") + i.toString(16);
    }

    return function generateUUID() {
      var d0 = (Math.random() * 0xffffffff) | 0;
      var d1 = (Math.random() * 0xffffffff) | 0;
      var d2 = (Math.random() * 0xffffffff) | 0;
      var d3 = (Math.random() * 0xffffffff) | 0;
      var uuid =
        lut[d0 & 0xff] +
        lut[(d0 >> 8) & 0xff] +
        lut[(d0 >> 16) & 0xff] +
        lut[(d0 >> 24) & 0xff] +
        "-" +
        lut[d1 & 0xff] +
        lut[(d1 >> 8) & 0xff] +
        "-" +
        lut[((d1 >> 16) & 0x0f) | 0x40] +
        lut[(d1 >> 24) & 0xff] +
        "-" +
        lut[(d2 & 0x3f) | 0x80] +
        lut[(d2 >> 8) & 0xff] +
        "-" +
        lut[(d2 >> 16) & 0xff] +
        lut[(d2 >> 24) & 0xff] +
        lut[d3 & 0xff] +
        lut[(d3 >> 8) & 0xff] +
        lut[(d3 >> 16) & 0xff] +
        lut[(d3 >> 24) & 0xff];

      //  字符串的转换操作后返回新的字符串，而JS垃圾回收器回收堆栈空间
      return uuid.toUpperCase();
    };
  })(),

  // 找到三个数据的中间值
  clamp: function(value, min, max) {
    return Math.max(min, Math.min(max, value));
  },

  // 计算M对N的模
  euclideanModulo: function(n, m) {
    return ((n % m) + m) % m;
  },

  // 线性映射,从[a1,a2]到[b1,b2]的映射过程
  mapLinear: function(x, a1, a2, b1, b2) {
    return b1 + ((x - a1) * (b2 - b1)) / (a2 - a1);
  },

  // 线性插值，t范围为（0-1）。lerp表示linear interpolation
  lerp: function(x, y, t) {
    return (1 - t) * x + t * y;
  },

  // 类sigmoid的夹逼函数，返回[0,1]。x的变化非线性影响Y。在神经网络中，单个神经元可以采用类似Sigmoid函数来触发激励
  smoothstep: function(x, min, max) {
    if (x <= min) return 0;
    if (x >= max) return 1;

    x = (x - min) / (max - min);

    return x * x * (3 - 2 * x);
  },

  // 更加精细的类sigmoid夹逼函数
  smootherstep: function(x, min, max) {
    if (x <= min) return 0;
    if (x >= max) return 1;

    x = (x - min) / (max - min);

    return x * x * x * (x * (x * 6 - 15) + 10);
  },

  // 返回给定区间内的随机整数
  randInt: function(low, high) {
    return low + Math.floor(Math.random() * (high - low + 1));
  },

  // 给定区间内的随机浮点型
  randFloat: function(low, high) {
    return low + Math.random() * (high - low);
  },

  //  将区间range，比如[0,1]转换为[-0.5,0.5]区间
  randFloatSpread: function(range) {
    return range * (0.5 - Math.random());
  },

  // 角度转弧度
  degToRad: function(degrees) {
    return degrees * _Math.DEG2RAD;
  },

  // 弧度转角度
  radToDeg: function(radians) {
    return radians * _Math.RAD2DEG;
  },

  // 判断参数是否是2的幂，基于位运算的高效算法。因为2^N-1所代表的数值所有位“1”
  isPowerOfTwo: function(value) {
    return (value & (value - 1)) === 0 && value !== 0;
  },

  // 给定数值返回大于它的最小2次幂数值
  // Math.log()表示自然对数；而Math.LN2表示对自然数e求底为2的对数
  ceilPowerOfTwo: function(value) {
    return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
  },

  // 给定value，返回小于该值的最大的2次幂数值
  floorPowerOfTwo: function(value) {
    return Math.pow(2, Math.floor(Math.log(value) / Math.LN2));
  }
};

export { _Math };
