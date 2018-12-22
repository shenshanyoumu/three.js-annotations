import { Vector3 } from "./Vector3.js";
import { _Math } from "./Math.js";

//  三维空间中的线段对象
function Line3(start, end) {
  this.start = start !== undefined ? start : new Vector3();
  this.end = end !== undefined ? end : new Vector3();
}

Object.assign(Line3.prototype, {
  set: function(start, end) {
    this.start.copy(start);
    this.end.copy(end);

    return this;
  },

  clone: function() {
    // 根据当前对象生成一个新的三维线段对象
    return new this.constructor().copy(this);
  },

  copy: function(line) {
    this.start.copy(line.start);
    this.end.copy(line.end);

    return this;
  },

  // 得到险段对象的中心点坐标
  getCenter: function(target) {
    if (target === undefined) {
      console.warn("THREE.Line3: .getCenter() target is now required");
      target = new Vector3();
    }

    // target是外部传入的用于接受当前线段中点的向量
    return target.addVectors(this.start, this.end).multiplyScalar(0.5);
  },

  // 计算线段向量
  delta: function(target) {
    if (target === undefined) {
      console.warn("THREE.Line3: .delta() target is now required");
      target = new Vector3();
    }

    return target.subVectors(this.end, this.start);
  },

  distanceSq: function() {
    return this.start.distanceToSquared(this.end);
  },

  distance: function() {
    return this.start.distanceTo(this.end);
  },

  // 当前线段在比例t处的位置
  at: function(t, target) {
    if (target === undefined) {
      console.warn("THREE.Line3: .at() target is now required");
      target = new Vector3();
    }

    return this.delta(target)
      .multiplyScalar(t)
      .add(this.start);
  },

  // 根据给定的point，找到线段上最接近的点
  closestPointToPointParameter: (function() {
    var startP = new Vector3();
    var startEnd = new Vector3();

    return function closestPointToPointParameter(point, clampToLine) {
      startP.subVectors(point, this.start);
      startEnd.subVectors(this.end, this.start);

      var startEnd2 = startEnd.dot(startEnd);
      var startEnd_startP = startEnd.dot(startP);

      var t = startEnd_startP / startEnd2;

      if (clampToLine) {
        t = _Math.clamp(t, 0, 1);
      }

      return t;
    };
  })(),

  closestPointToPoint: function(point, clampToLine, target) {
    var t = this.closestPointToPointParameter(point, clampToLine);

    if (target === undefined) {
      console.warn(
        "THREE.Line3: .closestPointToPoint() target is now required"
      );
      target = new Vector3();
    }

    return this.delta(target)
      .multiplyScalar(t)
      .add(this.start);
  },

  applyMatrix4: function(matrix) {
    this.start.applyMatrix4(matrix);
    this.end.applyMatrix4(matrix);

    return this;
  },

  // 线段相等，即使起点相等；而终点相等
  equals: function(line) {
    return line.start.equals(this.start) && line.end.equals(this.end);
  }
});

export { Line3 };
