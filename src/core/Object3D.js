import { Quaternion } from "../math/Quaternion.js";
import { Vector3 } from "../math/Vector3.js";
import { Matrix4 } from "../math/Matrix4.js";
import { EventDispatcher } from "./EventDispatcher.js";
import { Euler } from "../math/Euler.js";
import { Layers } from "./Layers.js";
import { Matrix3 } from "../math/Matrix3.js";
import { _Math } from "../math/Math.js";

// 3D场景中所有存放在scene容器中的模型是Object3D衍生的类对象
var object3DId = 0;

function Object3D() {
  // 每次创建一个对象，则全局技术器+1
  Object.defineProperty(this, "id", { value: object3DId++ });

  // 每个对象还具有UUID
  this.uuid = _Math.generateUUID();

  this.name = "";
  this.type = "Object3D";

  // 具有嵌套结构的对象模型结构
  this.parent = null;
  this.children = [];

  // 当在3D场景中创建新模型时，模型Y轴的朝向
  this.up = Object3D.DefaultUp.clone();

  // 模型的初始位置，一般在世界坐标系的原点
  var position = new Vector3();

  // 物体具有欧拉角属性和四元数属性。而且这两者等价
  var rotation = new Euler();
  var quaternion = new Quaternion();

  // 物体的缩放因子
  var scale = new Vector3(1, 1, 1);

  // 任何旋转变化和四元数变化，都要同步修改欧拉角/四元数的值
  function onRotationChange() {
    quaternion.setFromEuler(rotation, false);
  }

  function onQuaternionChange() {
    rotation.setFromQuaternion(quaternion, undefined, false);
  }

  // 下面onChange监听事件通过Object.defineProperties的set来拦截
  // 即只要模型的欧拉角或者四元数发生变化，则触发回调
  rotation.onChange(onRotationChange);
  quaternion.onChange(onQuaternionChange);

  Object.defineProperties(this, {
    position: {
      enumerable: true,
      value: position
    },
    rotation: {
      enumerable: true,
      value: rotation
    },
    quaternion: {
      enumerable: true,
      value: quaternion
    },
    scale: {
      enumerable: true,
      value: scale
    },

    // 从模型空间到相机空间的变换矩阵
    modelViewMatrix: {
      value: new Matrix4()
    },

    //正交矩阵
    normalMatrix: {
      value: new Matrix3()
    }
  });

  // 模型变换矩阵
  this.matrix = new Matrix4();

  // 模型从局部坐标系变换到世界坐标系的矩阵形式
  this.matrixWorld = new Matrix4();

  // 当模型发生变换操作是否需要修改变换矩阵
  this.matrixAutoUpdate = Object3D.DefaultMatrixAutoUpdate;
  this.matrixWorldNeedsUpdate = false;

  // 为了提高渲染性能，模型分层可以关注发生变化的部分
  this.layers = new Layers();
  this.visible = true;

  // 物体是否接受阴影效果
  this.castShadow = false;
  this.receiveShadow = false;

  // 物体是否根据出现在相机的frustum区域进行剔除，可以提升性能
  this.frustumCulled = true;
  this.renderOrder = 0;

  this.userData = {};
}

// 物体默认的up方向为Y轴
Object3D.DefaultUp = new Vector3(0, 1, 0);

// 物体发生变换是否触发变换矩阵的更新操作
Object3D.DefaultMatrixAutoUpdate = true;

// 注意，Object.create函数实现原型链继承。因此模型对象可以分发事件
Object3D.prototype = Object.assign(Object.create(EventDispatcher.prototype), {
  constructor: Object3D,

  isObject3D: true,

  // 物体的渲染钩子函数
  onBeforeRender: function() {},
  onAfterRender: function() {},

  // 模型应用变换矩阵进行变换操作
  applyMatrix: function(matrix) {
    this.matrix.multiplyMatrices(matrix, this.matrix);

    this.matrix.decompose(this.position, this.quaternion, this.scale);
  },

  // 下面模型的四元素/欧拉角发生变化，会触发相应的回调
  applyQuaternion: function(q) {
    this.quaternion.premultiply(q);

    return this;
  },

  setRotationFromAxisAngle: function(axis, angle) {
    this.quaternion.setFromAxisAngle(axis, angle);
  },

  setRotationFromEuler: function(euler) {
    this.quaternion.setFromEuler(euler, true);
  },

  // 截图矩阵的左上角3*3子矩阵，作为纯粹的旋转矩阵
  setRotationFromMatrix: function(m) {
    this.quaternion.setFromRotationMatrix(m);
  },

  setRotationFromQuaternion: function(q) {
    // assumes q is normalized

    this.quaternion.copy(q);
  },

  // 基于模型局部坐标系中特定轴的旋转操作，注意旋转轴不一定就是坐标轴
  rotateOnAxis: (function() {
    var q1 = new Quaternion();

    return function rotateOnAxis(axis, angle) {
      q1.setFromAxisAngle(axis, angle);

      this.quaternion.multiply(q1);

      return this;
    };
  })(),

  // 基于模型世界坐标系中特定轴的旋转操作，注意旋转轴不一定就是坐标轴
  rotateOnWorldAxis: (function() {
    var q1 = new Quaternion();

    return function rotateOnWorldAxis(axis, angle) {
      q1.setFromAxisAngle(axis, angle);

      this.quaternion.premultiply(q1);

      return this;
    };
  })(),

  // 基于模型局部坐标系的X轴旋转
  rotateX: (function() {
    var v1 = new Vector3(1, 0, 0);

    return function rotateX(angle) {
      return this.rotateOnAxis(v1, angle);
    };
  })(),

  rotateY: (function() {
    var v1 = new Vector3(0, 1, 0);

    return function rotateY(angle) {
      return this.rotateOnAxis(v1, angle);
    };
  })(),

  rotateZ: (function() {
    var v1 = new Vector3(0, 0, 1);

    return function rotateZ(angle) {
      return this.rotateOnAxis(v1, angle);
    };
  })(),

  // 基于模型局部坐标系特定轴的位移，注意特定轴不一定是坐标轴
  translateOnAxis: (function() {
    var v1 = new Vector3();

    return function translateOnAxis(axis, distance) {
      v1.copy(axis).applyQuaternion(this.quaternion);

      this.position.add(v1.multiplyScalar(distance));

      return this;
    };
  })(),

  translateX: (function() {
    var v1 = new Vector3(1, 0, 0);

    return function translateX(distance) {
      return this.translateOnAxis(v1, distance);
    };
  })(),

  translateY: (function() {
    var v1 = new Vector3(0, 1, 0);

    return function translateY(distance) {
      return this.translateOnAxis(v1, distance);
    };
  })(),

  translateZ: (function() {
    var v1 = new Vector3(0, 0, 1);

    return function translateZ(distance) {
      return this.translateOnAxis(v1, distance);
    };
  })(),

  // 从局部坐标系到世界坐标系转换，实现方式就是模型经过世界矩阵变换
  localToWorld: function(vector) {
    return vector.applyMatrix4(this.matrixWorld);
  },

  worldToLocal: (function() {
    var m1 = new Matrix4();

    return function worldToLocal(vector) {
      return vector.applyMatrix4(m1.getInverse(this.matrixWorld));
    };
  })(),

  // 物体的“lookAt”
  lookAt: (function() {
    var m1 = new Matrix4();
    var vector = new Vector3();

    return function lookAt(x, y, z) {
      if (x.isVector3) {
        vector.copy(x);
      } else {
        vector.set(x, y, z);
      }

      // 如果模型是相机，则lookAt修改变换矩阵；如果模型非相机，则相对于相机修改变换矩阵
      if (this.isCamera) {
        m1.lookAt(this.position, vector, this.up);
      } else {
        m1.lookAt(vector, this.position, this.up);
      }

      this.quaternion.setFromRotationMatrix(m1);
    };
  })(),

  // 添加子模型对象
  add: function(object) {
    if (arguments.length > 1) {
      for (var i = 0; i < arguments.length; i++) {
        this.add(arguments[i]);
      }

      return this;
    }

    if (object === this) {
      console.error(
        "THREE.Object3D.add: object can't be added as a child of itself.",
        object
      );
      return this;
    }

    if (object && object.isObject3D) {
      if (object.parent !== null) {
        object.parent.remove(object);
      }

      object.parent = this;

      // 当添加模型时，触发自定义事件
      object.dispatchEvent({ type: "added" });

      this.children.push(object);
    } else {
      console.error(
        "THREE.Object3D.add: object not an instance of THREE.Object3D.",
        object
      );
    }

    return this;
  },

  remove: function(object) {
    if (arguments.length > 1) {
      for (var i = 0; i < arguments.length; i++) {
        this.remove(arguments[i]);
      }

      return this;
    }

    var index = this.children.indexOf(object);

    if (index !== -1) {
      object.parent = null;

      // 当删除模型，则触发自定义事件
      object.dispatchEvent({ type: "removed" });

      this.children.splice(index, 1);
    }

    return this;
  },

  // 在3D场景中，所有模型构成一棵树。其中根节点为scene容器，为了帮助开发者快速找到模型树中特定模型，则定义了下列方法
  getObjectById: function(id) {
    return this.getObjectByProperty("id", id);
  },

  getObjectByName: function(name) {
    return this.getObjectByProperty("name", name);
  },

  // 递归搜索
  getObjectByProperty: function(name, value) {
    if (this[name] === value) return this;

    for (var i = 0, l = this.children.length; i < l; i++) {
      var child = this.children[i];
      var object = child.getObjectByProperty(name, value);

      if (object !== undefined) {
        return object;
      }
    }

    return undefined;
  },

  // 获得物体此时在世界坐标系中的位置
  getWorldPosition: function(target) {
    if (target === undefined) {
      console.warn(
        "THREE.Object3D: .getWorldPosition() target is now required"
      );
      target = new Vector3();
    }

    this.updateMatrixWorld(true);

    return target.setFromMatrixPosition(this.matrixWorld);
  },

  getWorldQuaternion: (function() {
    var position = new Vector3();
    var scale = new Vector3();

    return function getWorldQuaternion(target) {
      if (target === undefined) {
        console.warn(
          "THREE.Object3D: .getWorldQuaternion() target is now required"
        );
        target = new Quaternion();
      }

      this.updateMatrixWorld(true);

      this.matrixWorld.decompose(position, target, scale);

      return target;
    };
  })(),

  getWorldScale: (function() {
    var position = new Vector3();
    var quaternion = new Quaternion();

    return function getWorldScale(target) {
      if (target === undefined) {
        console.warn("THREE.Object3D: .getWorldScale() target is now required");
        target = new Vector3();
      }

      this.updateMatrixWorld(true);

      this.matrixWorld.decompose(position, quaternion, target);

      return target;
    };
  })(),

  getWorldDirection: (function() {
    var quaternion = new Quaternion();

    return function getWorldDirection(target) {
      if (target === undefined) {
        console.warn(
          "THREE.Object3D: .getWorldDirection() target is now required"
        );
        target = new Vector3();
      }

      this.getWorldQuaternion(quaternion);

      return target.set(0, 0, 1).applyQuaternion(quaternion);
    };
  })(),

  //用于模型拾取/碰撞检测的方法，采样类似射线投射技术
  // 在具体的Object类中实现raycast方法，类似C++中的函数重载
  raycast: function() {},

  // 递归遍历模型树，对每个节点进行回调处理
  traverse: function(callback) {
    callback(this);

    var children = this.children;

    for (var i = 0, l = children.length; i < l; i++) {
      children[i].traverse(callback);
    }
  },

  // 变量场景中所有可见的模型，模型不可见表示未被渲染
  traverseVisible: function(callback) {
    if (this.visible === false) return;

    callback(this);

    var children = this.children;

    for (var i = 0, l = children.length; i < l; i++) {
      children[i].traverseVisible(callback);
    }
  },

  // 得到当前模型所有祖先模型
  traverseAncestors: function(callback) {
    var parent = this.parent;

    if (parent !== null) {
      callback(parent);

      parent.traverseAncestors(callback);
    }
  },

  // 注意矩阵的合成分量包括位置变换、四元数旋转变换和缩放变换，最终形成的4*4矩阵就是一个完整的3D变换矩阵
  updateMatrix: function() {
    this.matrix.compose(
      this.position,
      this.quaternion,
      this.scale
    );

    this.matrixWorldNeedsUpdate = true;
  },

  updateMatrixWorld: function(force) {
    if (this.matrixAutoUpdate) this.updateMatrix();

    if (this.matrixWorldNeedsUpdate || force) {
      if (this.parent === null) {
        this.matrixWorld.copy(this.matrix);
      } else {
        this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
      }

      this.matrixWorldNeedsUpdate = false;

      force = true;
    }

    // update children

    var children = this.children;

    for (var i = 0, l = children.length; i < l; i++) {
      children[i].updateMatrixWorld(force);
    }
  },

  // 将对象转换为JSON对象
  toJSON: function(meta) {
    // meta is a string when called from JSON.stringify
    var isRootObject = meta === undefined || typeof meta === "string";

    var output = {};

    // meta is a hash used to collect geometries, materials.
    // not providing it implies that this is the root object
    // being serialized.
    if (isRootObject) {
      // initialize meta obj
      meta = {
        geometries: {},
        materials: {},
        textures: {},
        images: {},
        shapes: {}
      };

      output.metadata = {
        version: 4.5,
        type: "Object",
        generator: "Object3D.toJSON"
      };
    }

    // standard Object3D serialization

    var object = {};

    object.uuid = this.uuid;
    object.type = this.type;

    if (this.name !== "") object.name = this.name;
    if (this.castShadow === true) object.castShadow = true;
    if (this.receiveShadow === true) object.receiveShadow = true;
    if (this.visible === false) object.visible = false;
    if (this.frustumCulled === false) object.frustumCulled = false;
    if (this.renderOrder !== 0) object.renderOrder = this.renderOrder;
    if (JSON.stringify(this.userData) !== "{}") object.userData = this.userData;

    object.matrix = this.matrix.toArray();

    //

    function serialize(library, element) {
      if (library[element.uuid] === undefined) {
        library[element.uuid] = element.toJSON(meta);
      }

      return element.uuid;
    }

    if (this.geometry !== undefined) {
      object.geometry = serialize(meta.geometries, this.geometry);

      var parameters = this.geometry.parameters;

      if (parameters !== undefined && parameters.shapes !== undefined) {
        var shapes = parameters.shapes;

        if (Array.isArray(shapes)) {
          for (var i = 0, l = shapes.length; i < l; i++) {
            var shape = shapes[i];

            serialize(meta.shapes, shape);
          }
        } else {
          serialize(meta.shapes, shapes);
        }
      }
    }

    if (this.material !== undefined) {
      if (Array.isArray(this.material)) {
        var uuids = [];

        for (var i = 0, l = this.material.length; i < l; i++) {
          uuids.push(serialize(meta.materials, this.material[i]));
        }

        object.material = uuids;
      } else {
        object.material = serialize(meta.materials, this.material);
      }
    }

    //

    if (this.children.length > 0) {
      object.children = [];

      for (var i = 0; i < this.children.length; i++) {
        object.children.push(this.children[i].toJSON(meta).object);
      }
    }

    if (isRootObject) {
      var geometries = extractFromCache(meta.geometries);
      var materials = extractFromCache(meta.materials);
      var textures = extractFromCache(meta.textures);
      var images = extractFromCache(meta.images);
      var shapes = extractFromCache(meta.shapes);

      if (geometries.length > 0) output.geometries = geometries;
      if (materials.length > 0) output.materials = materials;
      if (textures.length > 0) output.textures = textures;
      if (images.length > 0) output.images = images;
      if (shapes.length > 0) output.shapes = shapes;
    }

    output.object = object;

    return output;

    // extract data from the cache hash
    // remove metadata on each item
    // and return as array
    function extractFromCache(cache) {
      var values = [];
      for (var key in cache) {
        var data = cache[key];
        delete data.metadata;
        values.push(data);
      }
      return values;
    }
  },

  clone: function(recursive) {
    return new this.constructor().copy(this, recursive);
  },

  //从给定的源模型对象进行拷贝，默认会递归模型及其包含的后代模型
  copy: function(source, recursive) {
    if (recursive === undefined) {
      recursive = true;
    }

    this.name = source.name;

    this.up.copy(source.up);

    this.position.copy(source.position);
    this.quaternion.copy(source.quaternion);
    this.scale.copy(source.scale);

    // matrix表示模型相对于局部坐标系的变换矩阵；
    // matrixWorld表示模型在世界坐标系中的变换矩阵
    this.matrix.copy(source.matrix);
    this.matrixWorld.copy(source.matrixWorld);

    // 当模型变换操作，是否自动触发对应的变换矩阵更新逻辑
    this.matrixAutoUpdate = source.matrixAutoUpdate;
    this.matrixWorldNeedsUpdate = source.matrixWorldNeedsUpdate;

    this.layers.mask = source.layers.mask;
    this.visible = source.visible;

    this.castShadow = source.castShadow;
    this.receiveShadow = source.receiveShadow;

    this.frustumCulled = source.frustumCulled;
    this.renderOrder = source.renderOrder;

    this.userData = JSON.parse(JSON.stringify(source.userData));

    if (recursive === true) {
      for (var i = 0; i < source.children.length; i++) {
        var child = source.children[i];
        this.add(child.clone());
      }
    }

    return this;
  }
});

export { Object3D };
