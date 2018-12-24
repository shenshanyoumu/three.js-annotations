import { Curve } from "./Curve.js";
import * as Curves from "../curves/Curves.js";

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 **/

/**************************************************************
 *	Curved Path - a curve path is simply a array of connected
 *  curves, but retains the api of a curve
 **************************************************************/

/**
 * 曲线簇，由一组曲线分段构成
 */
function CurvePath() {
  Curve.call(this);

  this.type = "CurvePath";

  this.curves = [];

  // 默认曲线不闭合
  this.autoClose = false;
}

CurvePath.prototype = Object.assign(Object.create(Curve.prototype), {
  constructor: CurvePath,

  // 在曲线簇中增加一段曲线
  add: function(curve) {
    this.curves.push(curve);
  },

  // 将曲线簇中第一个曲线分段的开始端点和最后一个曲线分段的结束端点形成新的曲线
  closePath: function() {
    var startPoint = this.curves[0].getPoint(0);
    var endPoint = this.curves[this.curves.length - 1].getPoint(1);

    if (!startPoint.equals(endPoint)) {
      this.curves.push(new Curves["LineCurve"](endPoint, startPoint));
    }
  },

  /**
   * 返回曲线簇中特定曲线分段中的特定线上坐标
   * @param {*} t 在[0,1]之间，针对整个曲线簇进行参数化处理
   */
  getPoint: function(t) {
    var d = t * this.getLength();
    var curveLengths = this.getCurveLengths();
    var i = 0;

    // To think about boundaries points.

    while (i < curveLengths.length) {
      if (curveLengths[i] >= d) {
        var diff = curveLengths[i] - d;
        var curve = this.curves[i];

        var segmentLength = curve.getLength();
        var u = segmentLength === 0 ? 0 : 1 - diff / segmentLength;

        return curve.getPointAt(u);
      }

      i++;
    }

    return null;

    // loop where sum != 0, sum > d , sum+1 <d
  },

  // 获得曲线簇总长度
  getLength: function() {
    var lens = this.getCurveLengths();
    return lens[lens.length - 1];
  },

  // 当曲线簇发生变化，则重新计算一些属性
  updateArcLengths: function() {
    this.needsUpdate = true;
    this.cacheLengths = null;
    this.getCurveLengths();
  },

  // 计算曲线簇的累进长度数组，其中累进数组中每个元素就是前面所有元素的长度和
  getCurveLengths: function() {
    if (this.cacheLengths && this.cacheLengths.length === this.curves.length) {
      return this.cacheLengths;
    }

    var lengths = [],
      sums = 0;

    // 计算曲线簇中每个曲线分段的长度，然后累进。注意lengths数组中每个元素表示前面所有曲线的累进
    for (var i = 0, l = this.curves.length; i < l; i++) {
      sums += this.curves[i].getLength();
      lengths.push(sums);
    }

    this.cacheLengths = lengths;

    return lengths;
  },

  // 对整个曲线簇切割，然后以精细化控制手段得到各个切割点附近满足算法的坐标点
  getSpacedPoints: function(divisions) {
    if (divisions === undefined) {
      divisions = 40;
    }

    var points = [];

    for (var i = 0; i <= divisions; i++) {
      points.push(this.getPoint(i / divisions));
    }

    if (this.autoClose) {
      points.push(points[0]);
    }

    return points;
  },

  getPoints: function(divisions) {
    divisions = divisions || 12;

    var points = [],
      last;

    for (var i = 0, curves = this.curves; i < curves.length; i++) {
      var curve = curves[i];
      var resolution =
        curve && curve.isEllipseCurve
          ? divisions * 2
          : curve && curve.isLineCurve
          ? 1
          : curve && curve.isSplineCurve
          ? divisions * curve.points.length
          : divisions;

      var pts = curve.getPoints(resolution);

      for (var j = 0; j < pts.length; j++) {
        var point = pts[j];

        if (last && last.equals(point)) continue;

        points.push(point);
        last = point;
      }
    }

    if (
      this.autoClose &&
      points.length > 1 &&
      !points[points.length - 1].equals(points[0])
    ) {
      points.push(points[0]);
    }

    return points;
  },

  copy: function(source) {
    Curve.prototype.copy.call(this, source);

    this.curves = [];

    for (var i = 0, l = source.curves.length; i < l; i++) {
      var curve = source.curves[i];

      this.curves.push(curve.clone());
    }

    this.autoClose = source.autoClose;

    return this;
  },

  toJSON: function() {
    var data = Curve.prototype.toJSON.call(this);

    data.autoClose = this.autoClose;
    data.curves = [];

    for (var i = 0, l = this.curves.length; i < l; i++) {
      var curve = this.curves[i];
      data.curves.push(curve.toJSON());
    }

    return data;
  },

  fromJSON: function(json) {
    Curve.prototype.fromJSON.call(this, json);

    this.autoClose = json.autoClose;
    this.curves = [];

    for (var i = 0, l = json.curves.length; i < l; i++) {
      var curve = json.curves[i];
      this.curves.push(new Curves[curve.type]().fromJSON(curve));
    }

    return this;
  }
});

export { CurvePath };
