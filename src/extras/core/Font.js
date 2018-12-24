import { ShapePath } from "./ShapePath.js";

/**
 * 字体曲线
 * @param {*} data 字体数据
 */
function Font(data) {
  this.type = "Font";

  this.data = data;
}

Object.assign(Font.prototype, {
  isFont: true,

  generateShapes: function(text, size, divisions) {
    //字符占用100单位尺寸，可以是像素也可以是其他度量单位
    if (size === undefined) {
      size = 100;
    }
    if (divisions === undefined) {
      divisions = 4;
    }

    var shapes = [];
    var paths = createPaths(text, size, divisions, this.data);

    for (var p = 0, pl = paths.length; p < pl; p++) {
      Array.prototype.push.apply(shapes, paths[p].toShapes());
    }

    return shapes;
  }
});

//得到文字的轮廓路径数据
function createPaths(text, size, divisions, data) {
  // 得到字符数组
  var chars = String(text).split("");
  var scale = size / data.resolution;
  var line_height =
    (data.boundingBox.yMax - data.boundingBox.yMin + data.underlineThickness) *
    scale;

  var paths = [];

  var offsetX = 0,
    offsetY = 0;

  for (var i = 0; i < chars.length; i++) {
    var char = chars[i];

    if (char === "\n") {
      offsetX = 0;
      offsetY -= line_height;
    } else {
      var ret = createPath(char, divisions, scale, offsetX, offsetY, data);
      offsetX += ret.offsetX;
      paths.push(ret.path);
    }
  }

  return paths;
}

// 绘制字符的轮廓路径
function createPath(char, divisions, scale, offsetX, offsetY, data) {
  var glyph = data.glyphs[char] || data.glyphs["?"];

  if (!glyph) return;

  var path = new ShapePath();

  var x, y, cpx, cpy, cpx1, cpy1, cpx2, cpy2;

  // 对于能够利用曲线绘制字符，需要在数据中保存字符的一些辅助属性
  if (glyph.o) {
    var outline =
      glyph._cachedOutline || (glyph._cachedOutline = glyph.o.split(" "));

    for (var i = 0, l = outline.length; i < l; ) {
      var action = outline[i++];

      switch (action) {
        case "m": // moveTo
          x = outline[i++] * scale + offsetX;
          y = outline[i++] * scale + offsetY;

          path.moveTo(x, y);

          break;

        case "l": // lineTo
          x = outline[i++] * scale + offsetX;
          y = outline[i++] * scale + offsetY;

          path.lineTo(x, y);

          break;

        case "q": // quadraticCurveTo
          cpx = outline[i++] * scale + offsetX;
          cpy = outline[i++] * scale + offsetY;
          cpx1 = outline[i++] * scale + offsetX;
          cpy1 = outline[i++] * scale + offsetY;

          path.quadraticCurveTo(cpx1, cpy1, cpx, cpy);

          break;

        case "b": // bezierCurveTo
          cpx = outline[i++] * scale + offsetX;
          cpy = outline[i++] * scale + offsetY;
          cpx1 = outline[i++] * scale + offsetX;
          cpy1 = outline[i++] * scale + offsetY;
          cpx2 = outline[i++] * scale + offsetX;
          cpy2 = outline[i++] * scale + offsetY;

          path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, cpx, cpy);

          break;
      }
    }
  }

  return { offsetX: glyph.ha * scale, path: path };
}

export { Font };
