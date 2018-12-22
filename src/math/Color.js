import { _Math } from "./Math.js";

// 内置的颜色属性
var ColorKeywords = {
  aliceblue: 0xf0f8ff,
  antiquewhite: 0xfaebd7,
  aqua: 0x00ffff,
  aquamarine: 0x7fffd4,
  azure: 0xf0ffff,
  beige: 0xf5f5dc,
  bisque: 0xffe4c4,
  black: 0x000000,
  blanchedalmond: 0xffebcd,
  blue: 0x0000ff,
  blueviolet: 0x8a2be2,
  brown: 0xa52a2a,
  burlywood: 0xdeb887,
  cadetblue: 0x5f9ea0,
  chartreuse: 0x7fff00,
  chocolate: 0xd2691e,
  coral: 0xff7f50,
  cornflowerblue: 0x6495ed,
  cornsilk: 0xfff8dc,
  crimson: 0xdc143c,
  cyan: 0x00ffff,
  darkblue: 0x00008b,
  darkcyan: 0x008b8b,
  darkgoldenrod: 0xb8860b,
  darkgray: 0xa9a9a9,
  darkgreen: 0x006400,
  darkgrey: 0xa9a9a9,
  darkkhaki: 0xbdb76b,
  darkmagenta: 0x8b008b,
  darkolivegreen: 0x556b2f,
  darkorange: 0xff8c00,
  darkorchid: 0x9932cc,
  darkred: 0x8b0000,
  darksalmon: 0xe9967a,
  darkseagreen: 0x8fbc8f,
  darkslateblue: 0x483d8b,
  darkslategray: 0x2f4f4f,
  darkslategrey: 0x2f4f4f,
  darkturquoise: 0x00ced1,
  darkviolet: 0x9400d3,
  deeppink: 0xff1493,
  deepskyblue: 0x00bfff,
  dimgray: 0x696969,
  dimgrey: 0x696969,
  dodgerblue: 0x1e90ff,
  firebrick: 0xb22222,
  floralwhite: 0xfffaf0,
  forestgreen: 0x228b22,
  fuchsia: 0xff00ff,
  gainsboro: 0xdcdcdc,
  ghostwhite: 0xf8f8ff,
  gold: 0xffd700,
  goldenrod: 0xdaa520,
  gray: 0x808080,
  green: 0x008000,
  greenyellow: 0xadff2f,
  grey: 0x808080,
  honeydew: 0xf0fff0,
  hotpink: 0xff69b4,
  indianred: 0xcd5c5c,
  indigo: 0x4b0082,
  ivory: 0xfffff0,
  khaki: 0xf0e68c,
  lavender: 0xe6e6fa,
  lavenderblush: 0xfff0f5,
  lawngreen: 0x7cfc00,
  lemonchiffon: 0xfffacd,
  lightblue: 0xadd8e6,
  lightcoral: 0xf08080,
  lightcyan: 0xe0ffff,
  lightgoldenrodyellow: 0xfafad2,
  lightgray: 0xd3d3d3,
  lightgreen: 0x90ee90,
  lightgrey: 0xd3d3d3,
  lightpink: 0xffb6c1,
  lightsalmon: 0xffa07a,
  lightseagreen: 0x20b2aa,
  lightskyblue: 0x87cefa,
  lightslategray: 0x778899,
  lightslategrey: 0x778899,
  lightsteelblue: 0xb0c4de,
  lightyellow: 0xffffe0,
  lime: 0x00ff00,
  limegreen: 0x32cd32,
  linen: 0xfaf0e6,
  magenta: 0xff00ff,
  maroon: 0x800000,
  mediumaquamarine: 0x66cdaa,
  mediumblue: 0x0000cd,
  mediumorchid: 0xba55d3,
  mediumpurple: 0x9370db,
  mediumseagreen: 0x3cb371,
  mediumslateblue: 0x7b68ee,
  mediumspringgreen: 0x00fa9a,
  mediumturquoise: 0x48d1cc,
  mediumvioletred: 0xc71585,
  midnightblue: 0x191970,
  mintcream: 0xf5fffa,
  mistyrose: 0xffe4e1,
  moccasin: 0xffe4b5,
  navajowhite: 0xffdead,
  navy: 0x000080,
  oldlace: 0xfdf5e6,
  olive: 0x808000,
  olivedrab: 0x6b8e23,
  orange: 0xffa500,
  orangered: 0xff4500,
  orchid: 0xda70d6,
  palegoldenrod: 0xeee8aa,
  palegreen: 0x98fb98,
  paleturquoise: 0xafeeee,
  palevioletred: 0xdb7093,
  papayawhip: 0xffefd5,
  peachpuff: 0xffdab9,
  peru: 0xcd853f,
  pink: 0xffc0cb,
  plum: 0xdda0dd,
  powderblue: 0xb0e0e6,
  purple: 0x800080,
  rebeccapurple: 0x663399,
  red: 0xff0000,
  rosybrown: 0xbc8f8f,
  royalblue: 0x4169e1,
  saddlebrown: 0x8b4513,
  salmon: 0xfa8072,
  sandybrown: 0xf4a460,
  seagreen: 0x2e8b57,
  seashell: 0xfff5ee,
  sienna: 0xa0522d,
  silver: 0xc0c0c0,
  skyblue: 0x87ceeb,
  slateblue: 0x6a5acd,
  slategray: 0x708090,
  slategrey: 0x708090,
  snow: 0xfffafa,
  springgreen: 0x00ff7f,
  steelblue: 0x4682b4,
  tan: 0xd2b48c,
  teal: 0x008080,
  thistle: 0xd8bfd8,
  tomato: 0xff6347,
  turquoise: 0x40e0d0,
  violet: 0xee82ee,
  wheat: 0xf5deb3,
  white: 0xffffff,
  whitesmoke: 0xf5f5f5,
  yellow: 0xffff00,
  yellowgreen: 0x9acd32
};

// 基于RGB颜色系统定义的颜色对象模型
function Color(r, g, b) {
  if (g === undefined && b === undefined) {
    return this.set(r);
  }

  return this.setRGB(r, g, b);
}

Object.assign(Color.prototype, {
  isColor: true,

  r: 1,
  g: 1,
  b: 1,

  set: function(value) {
    if (value && value.isColor) {
      this.copy(value);
    } else if (typeof value === "number") {
      this.setHex(value);
    } else if (typeof value === "string") {
      this.setStyle(value);
    }

    return this;
  },

  setScalar: function(scalar) {
    this.r = scalar;
    this.g = scalar;
    this.b = scalar;

    return this;
  },

  // 基于16进制数字表示的颜色
  setHex: function(hex) {
    hex = Math.floor(hex);

    this.r = ((hex >> 16) & 255) / 255;
    this.g = ((hex >> 8) & 255) / 255;
    this.b = (hex & 255) / 255;

    return this;
  },

  setRGB: function(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;

    return this;
  },

  // 设置HSL颜色系统
  setHSL: (function() {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);
      return p;
    }

    return function setHSL(h, s, l) {
      // h,s,l ranges are in 0.0 - 1.0
      h = _Math.euclideanModulo(h, 1);
      s = _Math.clamp(s, 0, 1);
      l = _Math.clamp(l, 0, 1);

      if (s === 0) {
        this.r = this.g = this.b = l;
      } else {
        var p = l <= 0.5 ? l * (1 + s) : l + s - l * s;
        var q = 2 * l - p;

        this.r = hue2rgb(q, p, h + 1 / 3);
        this.g = hue2rgb(q, p, h);
        this.b = hue2rgb(q, p, h - 1 / 3);
      }

      return this;
    };
  })(),

  setStyle: function(style) {
    function handleAlpha(string) {
      if (string === undefined) return;

      if (parseFloat(string) < 1) {
        console.warn(
          "THREE.Color: Alpha component of " + style + " will be ignored."
        );
      }
    }

    var m;

    if ((m = /^((?:rgb|hsl)a?)\(\s*([^\)]*)\)/.exec(style))) {
      // rgb / hsl

      var color;
      var name = m[1];
      var components = m[2];

      switch (name) {
        case "rgb":
        case "rgba":
          if (
            (color = /^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec(
              components
            ))
          ) {
            // rgb(255,0,0) rgba(255,0,0,0.5)
            this.r = Math.min(255, parseInt(color[1], 10)) / 255;
            this.g = Math.min(255, parseInt(color[2], 10)) / 255;
            this.b = Math.min(255, parseInt(color[3], 10)) / 255;

            handleAlpha(color[5]);

            return this;
          }

          if (
            (color = /^(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec(
              components
            ))
          ) {
            // rgb(100%,0%,0%) rgba(100%,0%,0%,0.5)
            this.r = Math.min(100, parseInt(color[1], 10)) / 100;
            this.g = Math.min(100, parseInt(color[2], 10)) / 100;
            this.b = Math.min(100, parseInt(color[3], 10)) / 100;

            handleAlpha(color[5]);

            return this;
          }

          break;

        case "hsl":
        case "hsla":
          if (
            (color = /^([0-9]*\.?[0-9]+)\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(,\s*([0-9]*\.?[0-9]+)\s*)?$/.exec(
              components
            ))
          ) {
            // hsl(120,50%,50%) hsla(120,50%,50%,0.5)
            var h = parseFloat(color[1]) / 360;
            var s = parseInt(color[2], 10) / 100;
            var l = parseInt(color[3], 10) / 100;

            handleAlpha(color[5]);

            return this.setHSL(h, s, l);
          }

          break;
      }
    } else if ((m = /^\#([A-Fa-f0-9]+)$/.exec(style))) {
      // hex color

      var hex = m[1];
      var size = hex.length;

      if (size === 3) {
        // #ff0
        this.r = parseInt(hex.charAt(0) + hex.charAt(0), 16) / 255;
        this.g = parseInt(hex.charAt(1) + hex.charAt(1), 16) / 255;
        this.b = parseInt(hex.charAt(2) + hex.charAt(2), 16) / 255;

        return this;
      } else if (size === 6) {
        // #ff0000
        this.r = parseInt(hex.charAt(0) + hex.charAt(1), 16) / 255;
        this.g = parseInt(hex.charAt(2) + hex.charAt(3), 16) / 255;
        this.b = parseInt(hex.charAt(4) + hex.charAt(5), 16) / 255;

        return this;
      }
    }

    if (style && style.length > 0) {
      // color keywords
      var hex = ColorKeywords[style];

      if (hex !== undefined) {
        // red
        this.setHex(hex);
      } else {
        // unknown color
        console.warn("THREE.Color: Unknown color " + style);
      }
    }

    return this;
  },

  clone: function() {
    return new this.constructor(this.r, this.g, this.b);
  },

  copy: function(color) {
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;

    return this;
  },

  //对RGB色彩系统增加gamma因子控制
  copyGammaToLinear: function(color, gammaFactor) {
    if (gammaFactor === undefined) {
      gammaFactor = 2.0;
    }

    this.r = Math.pow(color.r, gammaFactor);
    this.g = Math.pow(color.g, gammaFactor);
    this.b = Math.pow(color.b, gammaFactor);

    return this;
  },

  copyLinearToGamma: function(color, gammaFactor) {
    if (gammaFactor === undefined) {
      gammaFactor = 2.0;
    }

    var safeInverse = gammaFactor > 0 ? 1.0 / gammaFactor : 1.0;

    this.r = Math.pow(color.r, safeInverse);
    this.g = Math.pow(color.g, safeInverse);
    this.b = Math.pow(color.b, safeInverse);

    return this;
  },

  convertGammaToLinear: function() {
    var r = this.r,
      g = this.g,
      b = this.b;

    this.r = r * r;
    this.g = g * g;
    this.b = b * b;

    return this;
  },

  convertLinearToGamma: function() {
    this.r = Math.sqrt(this.r);
    this.g = Math.sqrt(this.g);
    this.b = Math.sqrt(this.b);

    return this;
  },

  // 下面rgb分量为[0,1]的小数，注意位运算中的"^"异或逻辑
  getHex: function() {
    return (
      ((this.r * 255) << 16) ^ ((this.g * 255) << 8) ^ ((this.b * 255) << 0)
    );
  },

  // 颜色的16进制字符串
  getHexString: function() {
    return ("000000" + this.getHex().toString()).slice(-6);
  },

  getHSL: function(target) {
    if (target === undefined) {
      console.warn("THREE.Color: .getHSL() target is now required");
      target = { h: 0, s: 0, l: 0 };
    }

    var r = this.r,
      g = this.g,
      b = this.b;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);

    var hue, saturation;
    var lightness = (min + max) / 2.0;

    if (min === max) {
      hue = 0;
      saturation = 0;
    } else {
      var delta = max - min;

      saturation =
        lightness <= 0.5 ? delta / (max + min) : delta / (2 - max - min);

      switch (max) {
        case r:
          hue = (g - b) / delta + (g < b ? 6 : 0);
          break;
        case g:
          hue = (b - r) / delta + 2;
          break;
        case b:
          hue = (r - g) / delta + 4;
          break;
      }

      hue /= 6;
    }

    target.h = hue;
    target.s = saturation;
    target.l = lightness;

    return target;
  },

  // 类似CSS的颜色样式
  getStyle: function() {
    return (
      "rgb(" +
      ((this.r * 255) | 0) +
      "," +
      ((this.g * 255) | 0) +
      "," +
      ((this.b * 255) | 0) +
      ")"
    );
  },

  offsetHSL: (function() {
    var hsl = {};

    return function(h, s, l) {
      this.getHSL(hsl);

      hsl.h += h;
      hsl.s += s;
      hsl.l += l;

      this.setHSL(hsl.h, hsl.s, hsl.l);

      return this;
    };
  })(),

  add: function(color) {
    this.r += color.r;
    this.g += color.g;
    this.b += color.b;

    return this;
  },

  addColors: function(color1, color2) {
    this.r = color1.r + color2.r;
    this.g = color1.g + color2.g;
    this.b = color1.b + color2.b;

    return this;
  },

  addScalar: function(s) {
    this.r += s;
    this.g += s;
    this.b += s;

    return this;
  },

  sub: function(color) {
    this.r = Math.max(0, this.r - color.r);
    this.g = Math.max(0, this.g - color.g);
    this.b = Math.max(0, this.b - color.b);

    return this;
  },

  multiply: function(color) {
    this.r *= color.r;
    this.g *= color.g;
    this.b *= color.b;

    return this;
  },

  multiplyScalar: function(s) {
    this.r *= s;
    this.g *= s;
    this.b *= s;

    return this;
  },

  // 线性插值
  lerp: function(color, alpha) {
    this.r += (color.r - this.r) * alpha;
    this.g += (color.g - this.g) * alpha;
    this.b += (color.b - this.b) * alpha;

    return this;
  },

  equals: function(c) {
    return c.r === this.r && c.g === this.g && c.b === this.b;
  },

  // 从数组中截取三个值来作为RGB分量
  fromArray: function(array, offset) {
    if (offset === undefined) offset = 0;

    this.r = array[offset];
    this.g = array[offset + 1];
    this.b = array[offset + 2];

    return this;
  },

  toArray: function(array, offset) {
    if (array === undefined) array = [];
    if (offset === undefined) offset = 0;

    array[offset] = this.r;
    array[offset + 1] = this.g;
    array[offset + 2] = this.b;

    return array;
  },

  toJSON: function() {
    return this.getHex();
  }
});

export { Color };
