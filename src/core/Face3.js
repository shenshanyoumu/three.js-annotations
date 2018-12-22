import { Color } from "../math/Color.js";
import { Vector3 } from "../math/Vector3.js";

//  三维表面，这是对WebGL中几何模型的表面建模对象
function Face3(a, b, c, normal, color, materialIndex) {
  this.a = a;
  this.b = b;
  this.c = c;

  // 顶点法向量
  this.normal = normal && normal.isVector3 ? normal : new Vector3();
  this.vertexNormals = Array.isArray(normal) ? normal : [];

  // 顶点颜色数组
  this.color = color && color.isColor ? color : new Color();
  this.vertexColors = Array.isArray(color) ? color : [];

  // 该表面需要的材质索引，注意材质对象具有光照特性，而纹理图片是不具备的
  this.materialIndex = materialIndex !== undefined ? materialIndex : 0;
}

Object.assign(Face3.prototype, {
  clone: function() {
    return new this.constructor().copy(this);
  },

  copy: function(source) {
    this.a = source.a;
    this.b = source.b;
    this.c = source.c;

    this.normal.copy(source.normal);
    this.color.copy(source.color);

    this.materialIndex = source.materialIndex;

    for (var i = 0, il = source.vertexNormals.length; i < il; i++) {
      this.vertexNormals[i] = source.vertexNormals[i].clone();
    }

    for (var i = 0, il = source.vertexColors.length; i < il; i++) {
      this.vertexColors[i] = source.vertexColors[i].clone();
    }

    return this;
  }
});

export { Face3 };
