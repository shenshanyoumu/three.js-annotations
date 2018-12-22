import { Box3 } from "./Box3.js";
import { Vector3 } from "./Vector3.js";

//  球面对象，中心点和半径
function Sphere(center, radius) {
  this.center = center !== undefined ? center : new Vector3();
  this.radius = radius !== undefined ? radius : 0;
}

Object.assign(Sphere.prototype, {
  set: function(center, radius) {
    this.center.copy(center);
    this.radius = radius;

    return this;
  },

  // 根据一组三维坐标点，计算球面结构，使得包含所有点
  setFromPoints: (function() {
    var box = new Box3();

    /**
     * optionalCenter表示是否给定球面结构的中心点，如果给定则只需要计算所有坐标点形成的最大半径即可；
     * 如果没有设定optionalCenter，则根据坐标点集合得到几何中心点
     */
    return function setFromPoints(points, optionalCenter) {
      var center = this.center;

      if (optionalCenter !== undefined) {
        center.copy(optionalCenter);
      } else {
        box.setFromPoints(points).getCenter(center);
      }

      var maxRadiusSq = 0;

      for (var i = 0, il = points.length; i < il; i++) {
        maxRadiusSq = Math.max(
          maxRadiusSq,
          center.distanceToSquared(points[i])
        );
      }

      this.radius = Math.sqrt(maxRadiusSq);

      return this;
    };
  })(),

  clone: function() {
    return new this.constructor().copy(this);
  },

  copy: function(sphere) {
    this.center.copy(sphere.center);
    this.radius = sphere.radius;

    return this;
  },

  empty: function() {
    return this.radius <= 0;
  },

  containsPoint: function(point) {
    return point.distanceToSquared(this.center) <= this.radius * this.radius;
  },

  distanceToPoint: function(point) {
    return point.distanceTo(this.center) - this.radius;
  },

  // 两球面相交测试
  intersectsSphere: function(sphere) {
    var radiusSum = this.radius + sphere.radius;

    return (
      sphere.center.distanceToSquared(this.center) <= radiusSum * radiusSum
    );
  },

  // 球面与盒子相交测试
  intersectsBox: function(box) {
    return box.intersectsSphere(this);
  },

  // 球面与平面相交测试
  intersectsPlane: function(plane) {
    return Math.abs(plane.distanceToPoint(this.center)) <= this.radius;
  },

  clampPoint: function(point, target) {
    var deltaLengthSq = this.center.distanceToSquared(point);

    if (target === undefined) {
      console.warn("THREE.Sphere: .clampPoint() target is now required");
      target = new Vector3();
    }

    target.copy(point);

    if (deltaLengthSq > this.radius * this.radius) {
      target.sub(this.center).normalize();
      target.multiplyScalar(this.radius).add(this.center);
    }

    return target;
  },

  // 获得球面的包围盒
  getBoundingBox: function(target) {
    if (target === undefined) {
      console.warn("THREE.Sphere: .getBoundingBox() target is now required");
      target = new Box3();
    }

    target.set(this.center, this.center);
    target.expandByScalar(this.radius);

    return target;
  },

  // 球面结构的变换方法
  applyMatrix4: function(matrix) {
    this.center.applyMatrix4(matrix);
    this.radius = this.radius * matrix.getMaxScaleOnAxis();

    return this;
  },

  translate: function(offset) {
    this.center.add(offset);

    return this;
  },

  equals: function(sphere) {
    return sphere.center.equals(this.center) && sphere.radius === this.radius;
  }
});

export { Sphere };
