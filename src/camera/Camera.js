import { Matrix4 } from "../math/Matrix4.js";
import { Quaternion } from "../math/Quaternion.js";
import { Object3D } from "../core/Object3D.js";
import { Vector3 } from "../math/Vector3.js";

// 所谓相机，其实可以理解为一组矩阵变换过程。用于将3D场景中的模型从世界坐标系投影到相机的坐标系空间中
function Camera() {
  // 类似class定义中的super()语法糖，
  // 用于继承Object3D的构造属性
  Object3D.call(this);

  this.type = "Camera";

  // 相机的世界坐标系逆转为相机模型局部坐标系
  this.matrixWorldInverse = new Matrix4();

  // 在webgl中顶点着色器定义MVP变换矩阵，即从模型局部坐标系
  // 到相机坐标系，然后从相机坐标系到屏幕坐标系。下面的矩阵
  // 就是从相机坐标系到屏幕坐标系的转换矩阵
  this.projectionMatrix = new Matrix4();
}

// 相机类也是Object3D的子类
Camera.prototype = Object.assign(Object.create(Object3D.prototype), {
  constructor: Camera,

  isCamera: true,

  copy: function(source, recursive) {
    Object3D.prototype.copy.call(this, source, recursive);

    this.matrixWorldInverse.copy(source.matrixWorldInverse);
    this.projectionMatrix.copy(source.projectionMatrix);

    return this;
  },

  // 相机在世界坐标系中的朝向，相机初始朝向为(0,0,-1)即Z轴负方向
  // up方向为(0,1,0)即上方向为Y轴正方向
  getWorldDirection: (function() {
    var quaternion = new Quaternion();

    return function getWorldDirection(target) {
      if (target === undefined) {
        console.warn(
          "THREE.Camera: .getWorldDirection() target is now required"
        );
        target = new Vector3();
      }

      // 获得相机在世界坐标系中的四元数，
      // 即经过四元数处理后相机从初始位置旋转到当前位置
      this.getWorldQuaternion(quaternion);

      //相机从初始位置经过四元数变换得到当前位置的旋转状态
      return target.set(0, 0, -1).applyQuaternion(quaternion);
    };
  })(),

  // 相机或者场景运动后，可以手动调用得到世界坐标系
  updateMatrixWorld: function(force) {
    Object3D.prototype.updateMatrixWorld.call(this, force);

    this.matrixWorldInverse.getInverse(this.matrixWorld);
  },

  clone: function() {
    return new this.constructor().copy(this);
  }
});

export { Camera };
