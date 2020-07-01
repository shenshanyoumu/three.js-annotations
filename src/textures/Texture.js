/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author szimek / https://github.com/szimek/
 */

import { EventDispatcher } from "../core/EventDispatcher.js";

import {
  MirroredRepeatWrapping,
  ClampToEdgeWrapping,
  RepeatWrapping,
  LinearEncoding,
  UnsignedByteType,
  RGBAFormat,
  LinearMipMapLinearFilter,
  LinearFilter,
  UVMapping
} from "../constants.js";
import { _Math } from "../math/Math.js";
import { Vector2 } from "../math/Vector2.js";
import { Matrix3 } from "../math/Matrix3.js";

// 3D场景中所有纹理都被编号
var textureId = 0;

/**
 * 基础纹理对象
 * @param {*} image 纹理位图
 * @param {*} mapping
 * @param {*} wrapS
 * @param {*} wrapT
 * @param {*} magFilter
 * @param {*} minFilter
 * @param {*} format
 * @param {*} type
 * @param {*} anisotropy ，各向异性参数用于控制位图不同区域的光泽度，用于简单模拟光照效果
 * @param {*} encoding
 */
function Texture(
  image,
  mapping,
  wrapS,
  wrapT,
  magFilter,
  minFilter,
  format,
  type,
  anisotropy,
  encoding
) {
  Object.defineProperty(this, "id", { value: textureId++ });

  this.uuid = _Math.generateUUID();

  this.name = "";

  this.image = image !== undefined ? image : Texture.DEFAULT_IMAGE;

  // MipMAP技术,采用二维位图贴图来模拟三维效果，比如墙壁的层次感
  this.mipmaps = [];

  this.mapping = mapping !== undefined ? mapping : Texture.DEFAULT_MAPPING;

  //ST坐标贴图，一种滚动重复的贴图技术。比如地砖贴图
  this.wrapS = wrapS !== undefined ? wrapS : ClampToEdgeWrapping;
  this.wrapT = wrapT !== undefined ? wrapT : ClampToEdgeWrapping;

  // 当纹理图像与模型表面尺寸不一致时需要进行缩放采样过程
  this.magFilter = magFilter !== undefined ? magFilter : LinearFilter;
  this.minFilter =
    minFilter !== undefined ? minFilter : LinearMipMapLinearFilter;

  // 各向异性，可以增强纹理贴图的清晰度
  this.anisotropy = anisotropy !== undefined ? anisotropy : 1;

  this.format = format !== undefined ? format : RGBAFormat;
  this.type = type !== undefined ? type : UnsignedByteType;

  this.offset = new Vector2(0, 0);
  this.repeat = new Vector2(1, 1);
  this.center = new Vector2(0, 0);
  this.rotation = 0;

  //   纹理对象也具有局部坐标系
  this.matrixAutoUpdate = true;
  this.matrix = new Matrix3();

  this.generateMipmaps = true;
  this.premultiplyAlpha = false;
  this.flipY = true;
  this.unpackAlignment = 4; // valid values: 1, 2, 4, 8 (see http://www.khronos.org/opengles/sdk/docs/man/xhtml/glPixelStorei.xml)

  //当编码格式不等于THREE.LinearEncoing，则只支持地图贴图、环境贴图和反射贴图；
  //当修改材质的贴图编码形式，需要手动调用Material.needsUpdate来触发材质对象重新编译

  this.encoding = encoding !== undefined ? encoding : LinearEncoding;

  this.version = 0;
  this.onUpdate = null;
}

Texture.DEFAULT_IMAGE = undefined;

// 默认为UV映射
Texture.DEFAULT_MAPPING = UVMapping;

// 贴图对象具有事件分发能力
Texture.prototype = Object.assign(Object.create(EventDispatcher.prototype), {
  constructor: Texture,

  isTexture: true,

  clone: function() {
    return new this.constructor().copy(this);
  },

  copy: function(source) {
    this.name = source.name;

    this.image = source.image;
    this.mipmaps = source.mipmaps.slice(0);

    this.mapping = source.mapping;

    this.wrapS = source.wrapS;
    this.wrapT = source.wrapT;

    this.magFilter = source.magFilter;
    this.minFilter = source.minFilter;

    this.anisotropy = source.anisotropy;

    this.format = source.format;
    this.type = source.type;

    this.offset.copy(source.offset);
    this.repeat.copy(source.repeat);
    this.center.copy(source.center);
    this.rotation = source.rotation;

    this.matrixAutoUpdate = source.matrixAutoUpdate;
    this.matrix.copy(source.matrix);

    this.generateMipmaps = source.generateMipmaps;
    this.premultiplyAlpha = source.premultiplyAlpha;
    this.flipY = source.flipY;
    this.unpackAlignment = source.unpackAlignment;
    this.encoding = source.encoding;

    return this;
  },

  toJSON: function(meta) {
    var isRootObject = meta === undefined || typeof meta === "string";

    if (!isRootObject && meta.textures[this.uuid] !== undefined) {
      return meta.textures[this.uuid];
    }

    function getDataURL(image) {
      var canvas;

      if (image instanceof HTMLCanvasElement) {
        canvas = image;
      } else {
        canvas = document.createElementNS(
          "http://www.w3.org/1999/xhtml",
          "canvas"
        );
        canvas.width = image.width;
        canvas.height = image.height;

        var context = canvas.getContext("2d");

        if (image instanceof ImageData) {
          context.putImageData(image, 0, 0);
        } else {
          context.drawImage(image, 0, 0, image.width, image.height);
        }
      }

      if (canvas.width > 2048 || canvas.height > 2048) {
        return canvas.toDataURL("image/jpeg", 0.6);
      } else {
        return canvas.toDataURL("image/png");
      }
    }

    var output = {
      metadata: {
        version: 4.5,
        type: "Texture",
        generator: "Texture.toJSON"
      },

      uuid: this.uuid,
      name: this.name,

      mapping: this.mapping,

      // 贴图在X方向/Y方向的重复，以及偏移
      repeat: [this.repeat.x, this.repeat.y],
      offset: [this.offset.x, this.offset.y],
      center: [this.center.x, this.center.y],
      rotation: this.rotation,

      wrap: [this.wrapS, this.wrapT],

      format: this.format,
      minFilter: this.minFilter,
      magFilter: this.magFilter,
      anisotropy: this.anisotropy,

      flipY: this.flipY
    };

    if (this.image !== undefined) {
      // TODO: Move to THREE.Image

      var image = this.image;

      if (image.uuid === undefined) {
        image.uuid = _Math.generateUUID(); // UGH
      }

      if (!isRootObject && meta.images[image.uuid] === undefined) {
        meta.images[image.uuid] = {
          uuid: image.uuid,
          url: getDataURL(image)
        };
      }

      output.image = image.uuid;
    }

    if (!isRootObject) {
      meta.textures[this.uuid] = output;
    }

    return output;
  },

  //   当销毁模型表面的贴图，则触发自定义事件
  dispose: function() {
    this.dispatchEvent({ type: "dispose" });
  },

  transformUv: function(uv) {
    if (this.mapping !== UVMapping) {
      return;
    }

    // 应用3*3矩阵变换，其实就是对贴图进行旋转变换
    uv.applyMatrix3(this.matrix);

    if (uv.x < 0 || uv.x > 1) {
      switch (this.wrapS) {
        case RepeatWrapping:
          uv.x = uv.x - Math.floor(uv.x);
          break;

        case ClampToEdgeWrapping:
          uv.x = uv.x < 0 ? 0 : 1;
          break;

        case MirroredRepeatWrapping:
          if (Math.abs(Math.floor(uv.x) % 2) === 1) {
            uv.x = Math.ceil(uv.x) - uv.x;
          } else {
            uv.x = uv.x - Math.floor(uv.x);
          }
          break;
      }
    }

    if (uv.y < 0 || uv.y > 1) {
      switch (this.wrapT) {
        case RepeatWrapping:
          uv.y = uv.y - Math.floor(uv.y);
          break;

        case ClampToEdgeWrapping:
          uv.y = uv.y < 0 ? 0 : 1;
          break;

        case MirroredRepeatWrapping:
          if (Math.abs(Math.floor(uv.y) % 2) === 1) {
            uv.y = Math.ceil(uv.y) - uv.y;
          } else {
            uv.y = uv.y - Math.floor(uv.y);
          }
          break;
      }
    }

    if (this.flipY) {
      uv.y = 1 - uv.y;
    }
  }
});

// 当贴图对象发生了更新操作，则对该贴图进行版本管理
Object.defineProperty(Texture.prototype, "needsUpdate", {
  set: function(value) {
    if (value === true) {
      this.version++;
    }
  }
});

export { Texture };
