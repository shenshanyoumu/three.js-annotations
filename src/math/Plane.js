import { Matrix3 } from "./Matrix3.js";
import { Vector3 } from "./Vector3.js";

/**
 * 由法向量和常数可以对三维空间中特定的平面进行描述
 * @param {*} normal 定义平面的归一化法向量
 * @param {*} constant 确定三维空间唯一的平面。
 * 因为只通过法向量无法确定唯一的平面，而是一组相互平行的平面簇。
 * constant表示在法向量方向上与原点的距离
 */
function Plane(normal, constant) {
  this.normal = normal !== undefined ? normal : new Vector3(1, 0, 0);
  this.constant = constant !== undefined ? constant : 0;
}

Object.assign(Plane.prototype, {
  set: function(normal, constant) {
    this.normal.copy(normal);
    this.constant = constant;

    return this;
  },

  setComponents: function(x, y, z, w) {
    this.normal.set(x, y, z);
    this.constant = w;

    return this;
  },

  // normal表示外部传递的平面法向量；point表示共面的一个给定点坐标
  // 基于法向量和共面点的内积计算，得到的是共面点与原点形成的向量在法向量方向上的投影距离
  // 根据平面方程可知，这种确定了法向量和法向量方向上与原点距离constant的坐标点，唯一平面
  setFromNormalAndCoplanarPoint: function(normal, point) {
    this.normal.copy(normal);
    this.constant = -point.dot(this.normal);

    return this;
  },

  setFromCoplanarPoints: (function() {
    var v1 = new Vector3();
    var v2 = new Vector3();

    // 根据三个共面点，计算平面的法向量和法向量上与原点的截距constant可以唯一确定平面
    return function setFromCoplanarPoints(a, b, c) {
      var normal = v1
        .subVectors(c, b)
        .cross(v2.subVectors(a, b))
        .normalize();
      this.setFromNormalAndCoplanarPoint(normal, a);

      return this;
    };
  })(),

  clone: function() {
    return new this.constructor().copy(this);
  },

  copy: function(plane) {
    this.normal.copy(plane.normal);
    this.constant = plane.constant;

    return this;
  },

  // 平面参数方程的归一化处理，即法向量归一化和常熟因子constant归一化
  normalize: function() {
    var inverseNormalLength = 1.0 / this.normal.length();
    this.normal.multiplyScalar(inverseNormalLength);
    this.constant *= inverseNormalLength;

    return this;
  },

  negate: function() {
    this.constant *= -1;
    this.normal.negate();

    return this;
  },

  //注意constant变量是平面与原点在世界坐标系中的距离
  // 而point和normal相对于平面的局部坐标系
  distanceToPoint: function(point) {
    return this.normal.dot(point) + this.constant;
  },

  // 计算平面与球面的距离，计算方法就是平面与球面中心距离-球面半径。
  // 这个方法用于平面与球面相交检测过程
  distanceToSphere: function(sphere) {
    return this.distanceToPoint(sphere.center) - sphere.radius;
  },

  // 给定point在平面上的投影
  projectPoint: function(point, target) {
    if (target === undefined) {
      console.warn("THREE.Plane: .projectPoint() target is now required");
      target = new Vector3();
    }

    //
    return target
      .copy(this.normal)
      .multiplyScalar(-this.distanceToPoint(point))
      .add(point);
  },

  // 计算线段是否与平面相交，如果相交则得到交点
  intersectLine: (function() {
    var v1 = new Vector3();

    return function intersectLine(line, target) {
      if (target === undefined) {
        console.warn("THREE.Plane: .intersectLine() target is now required");
        target = new Vector3();
      }

      // 计算线段的方向向量
      var direction = line.delta(v1);

      var denominator = this.normal.dot(direction);

      // 如果直线方向向量垂直与平面法向量，并且线段起点在平面上，则说明线段就在平面内；否则说明永远不会相交
      if (denominator === 0) {
        if (this.distanceToPoint(line.start) === 0) {
          return target.copy(line.start);
        }

        return undefined;
      }

      //如果线段方向向量与平面法向量不垂直，则线段延展直线总是会与平面相交
      var t = -(line.start.dot(this.normal) + this.constant) / denominator;

      // 表示线段本身没有与平面相交
      if (t < 0 || t > 1) {
        return undefined;
      }

      return target
        .copy(direction)
        .multiplyScalar(t)
        .add(line.start);
    };
  })(),

  // 判断线段是否与平面相交
  intersectsLine: function(line) {
    var startSign = this.distanceToPoint(line.start);
    var endSign = this.distanceToPoint(line.end);

    return (startSign < 0 && endSign > 0) || (endSign < 0 && startSign > 0);
  },

  // 判断三维包围盒是否与平面相交
  intersectsBox: function(box) {
    return box.intersectsPlane(this);
  },

  // 判断球面是否与平面相交
  intersectsSphere: function(sphere) {
    return sphere.intersectsPlane(this);
  },

  // 计算法向量在平面上的投影点
  coplanarPoint: function(target) {
    if (target === undefined) {
      console.warn("THREE.Plane: .coplanarPoint() target is now required");
      target = new Vector3();
    }

    return target.copy(this.normal).multiplyScalar(-this.constant);
  },

  // 平面对象的变换操作，4*矩阵是仿射变换的代数结构
  applyMatrix4: (function() {
    var v1 = new Vector3();
    var m1 = new Matrix3();

    return function applyMatrix4(matrix, optionalNormalMatrix) {
      var normalMatrix = optionalNormalMatrix || m1.getNormalMatrix(matrix);

      var referencePoint = this.coplanarPoint(v1).applyMatrix4(matrix);

      var normal = this.normal.applyMatrix3(normalMatrix).normalize();

      this.constant = -referencePoint.dot(normal);

      return this;
    };
  })(),

  // offset向量不一定沿着法向量方向，因此需要将offset向量投影到法向量上
  // 然后在法向量上进行上下平移操作
  translate: function(offset) {
    this.constant -= offset.dot(this.normal);

    return this;
  },

  equals: function(plane) {
    return plane.normal.equals(this.normal) && plane.constant === this.constant;
  }
});

export { Plane };
