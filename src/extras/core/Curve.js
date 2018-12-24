import { _Math } from "../../math/Math.js";
import { Vector3 } from "../../math/Vector3.js";
import { Matrix4 } from "../../math/Matrix4.js";

/**
 * Curve基类，定义了曲线的构成和基础方法
 */
function Curve() {
  this.type = "Curve";

  // 曲线积分长度分段，因为绘制曲线采样控制点方法插值
  this.arcLengthDivisions = 200;
}

Object.assign(Curve.prototype, {
  // 具体的子类会重写该方法
  getPoint: function() {
    console.warn("THREE.Curve: .getPoint() not implemented.");
    return null;
  },

  /**
   * 得到t参数对应的曲线上的点
   * @param {*} u 在[0,1]之间,用于映射到更加精细化的t参数
   * @param {*} optionalTarget
   */
  getPointAt: function(u, optionalTarget) {
    var t = this.getUtoTmapping(u);
    return this.getPoint(t, optionalTarget);
  },

  /**
   * 根据采样频度，得到采样点序列
   * @param {*} divisions 曲线采样频度
   */
  getPoints: function(divisions) {
    if (divisions === undefined) {
      divisions = 5;
    }

    var points = [];

    // 均匀采样
    for (var d = 0; d <= divisions; d++) {
      points.push(this.getPoint(d / divisions));
    }

    return points;
  },

  /**
   * 根据采样频度并精细化采样点，而不是简单的均匀采样
   * @param {*} divisions 对原生曲线的采样频度
   */
  getSpacedPoints: function(divisions) {
    if (divisions === undefined) {
      divisions = 5;
    }

    var points = [];

    for (var d = 0; d <= divisions; d++) {
      points.push(this.getPointAt(d / divisions));
    }

    return points;
  },

  // 计算整个曲线长度
  getLength: function() {
    var lengths = this.getLengths();
    return lengths[lengths.length - 1];
  },

  // 下面返回的数组中，每个元素表示前面所有点形成的曲线的长度+当前点与前一个点的长度
  // 因此数组表示曲线的分段累进长度
  getLengths: function(divisions) {
    if (divisions === undefined) {
      divisions = this.arcLengthDivisions;
    }

    if (
      this.cacheArcLengths &&
      this.cacheArcLengths.length === divisions + 1 &&
      !this.needsUpdate
    ) {
      return this.cacheArcLengths;
    }

    this.needsUpdate = false;

    var cache = [];
    var current,
      last = this.getPoint(0);
    var p,
      sum = 0;

    cache.push(0);

    // 注意下面计算过程，表示曲线分段累进长度计算
    for (p = 1; p <= divisions; p++) {
      current = this.getPoint(p / divisions);
      sum += current.distanceTo(last);
      cache.push(sum);
      last = current;
    }

    this.cacheArcLengths = cache;

    return cache;
  },

  // 当曲线状态发生变化，触发更新操作
  updateArcLengths: function() {
    this.needsUpdate = true;
    this.getLengths();
  },

  /**
   * 给定参数u，计算对应的参数t并得到p点，从P点向两端等距distance采样
   * @param {*} u 在[0,1]之间
   * @param {*} distance 在曲线上采样点之间的等距长度
   */
  getUtoTmapping: function(u, distance) {
    // 曲线的分段累进长度形成的数组
    var arcLengths = this.getLengths();

    var i = 0,
      il = arcLengths.length;

    var targetArcLength;

    // 当显式传递distance，则设置targetArcLength为distance；否则基于曲线总长度在参数u处的值作为目标小弧线长度
    if (distance) {
      targetArcLength = distance;
    } else {
      targetArcLength = u * arcLengths[il - 1];
    }

    var low = 0,
      high = il - 1,
      comparison;

    //二分查找，计算与targetArcLength最接近的原生曲线累进长度对应的索引点
    while (low <= high) {
      i = Math.floor(low + (high - low) / 2);

      comparison = arcLengths[i] - targetArcLength;

      if (comparison < 0) {
        low = i + 1;
      } else if (comparison > 0) {
        high = i - 1;
      } else {
        high = i;
        break;
      }
    }

    i = high;

    // 如果原生曲线在i点的累进长度恰好等于targetArcLength，则直接比例返回即可
    if (arcLengths[i] === targetArcLength) {
      return i / (il - 1);
    }

    // 如果原生曲线在i 点的累进长度只是最接近targetArcLength，则下面计算过程可以细粒度控制参数t的值
    var lengthBefore = arcLengths[i];
    var lengthAfter = arcLengths[i + 1];

    // 计算原生曲线上i点和i+1点之间的小曲线长度
    var segmentLength = lengthAfter - lengthBefore;

    // targetArcLength - lengthBefore表示剩余量
    var segmentFraction = (targetArcLength - lengthBefore) / segmentLength;

    var t = (i + segmentFraction) / (il - 1);

    return t;
  },

  // 计算在二维坐标系中，曲线参数t点对应的正切向量
  getTangent: function(t) {
    var delta = 0.0001;
    var t1 = t - delta;
    var t2 = t + delta;

    // t的范围为[0，1]之间
    if (t1 < 0) t1 = 0;
    if (t2 > 1) t2 = 1;

    // 从参数t得到曲线在二维坐标系中的坐标点
    var pt1 = this.getPoint(t1);
    var pt2 = this.getPoint(t2);

    var vec = pt2.clone().sub(pt1);
    return vec.normalize();
  },

  /**
   * 从u映射到t,用于得到精细控制的参数
   * @param {*} u在[0,1]之间
   */
  getTangentAt: function(u) {
    var t = this.getUtoTmapping(u);
    return this.getTangent(t);
  },

  /**
   * frenet坐标系，在无人驾驶领域，车辆与道路的关系用frenet坐标系描述比用大地坐标系的GPS位置描述更加清晰
   * @param {*} segments
   * @param {*} closed
   */

  computeFrenetFrames: function(segments, closed) {
    // see http://www.cs.indiana.edu/pub/techreports/TR425.pdf

    var normal = new Vector3();

    var tangents = [];
    var normals = [];
    var binormals = [];

    var vec = new Vector3();
    var mat = new Matrix4();

    var i, u, theta;

    // compute the tangent vectors for each segment on the curve

    for (i = 0; i <= segments; i++) {
      u = i / segments;

      tangents[i] = this.getTangentAt(u);
      tangents[i].normalize();
    }

    // select an initial normal vector perpendicular to the first tangent vector,
    // and in the direction of the minimum tangent xyz component

    normals[0] = new Vector3();
    binormals[0] = new Vector3();
    var min = Number.MAX_VALUE;
    var tx = Math.abs(tangents[0].x);
    var ty = Math.abs(tangents[0].y);
    var tz = Math.abs(tangents[0].z);

    if (tx <= min) {
      min = tx;
      normal.set(1, 0, 0);
    }

    if (ty <= min) {
      min = ty;
      normal.set(0, 1, 0);
    }

    if (tz <= min) {
      normal.set(0, 0, 1);
    }

    vec.crossVectors(tangents[0], normal).normalize();

    normals[0].crossVectors(tangents[0], vec);
    binormals[0].crossVectors(tangents[0], normals[0]);

    // compute the slowly-varying normal and binormal vectors for each segment on the curve

    for (i = 1; i <= segments; i++) {
      normals[i] = normals[i - 1].clone();

      binormals[i] = binormals[i - 1].clone();

      vec.crossVectors(tangents[i - 1], tangents[i]);

      if (vec.length() > Number.EPSILON) {
        vec.normalize();

        theta = Math.acos(_Math.clamp(tangents[i - 1].dot(tangents[i]), -1, 1)); // clamp for floating pt errors

        normals[i].applyMatrix4(mat.makeRotationAxis(vec, theta));
      }

      binormals[i].crossVectors(tangents[i], normals[i]);
    }

    // if the curve is closed, postprocess the vectors so the first and last normal vectors are the same

    if (closed === true) {
      theta = Math.acos(_Math.clamp(normals[0].dot(normals[segments]), -1, 1));
      theta /= segments;

      if (
        tangents[0].dot(vec.crossVectors(normals[0], normals[segments])) > 0
      ) {
        theta = -theta;
      }

      for (i = 1; i <= segments; i++) {
        // twist a little...
        normals[i].applyMatrix4(mat.makeRotationAxis(tangents[i], theta * i));
        binormals[i].crossVectors(tangents[i], normals[i]);
      }
    }

    return {
      tangents: tangents,
      normals: normals,
      binormals: binormals
    };
  },

  clone: function() {
    return new this.constructor().copy(this);
  },

  copy: function(source) {
    this.arcLengthDivisions = source.arcLengthDivisions;

    return this;
  },

  toJSON: function() {
    var data = {
      metadata: {
        version: 4.5,
        type: "Curve",
        generator: "Curve.toJSON"
      }
    };

    data.arcLengthDivisions = this.arcLengthDivisions;
    data.type = this.type;

    return data;
  },

  fromJSON: function(json) {
    this.arcLengthDivisions = json.arcLengthDivisions;

    return this;
  }
});

export { Curve };
