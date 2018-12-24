import { Vector2 } from "../../math/Vector2.js";
import { Curve } from "../core/Curve.js";

/**
 * 二维平面上的线段曲线
 * @param {*} v1 线段开始点
 * @param {*} v2 线段结束点
 */
function LineCurve(v1, v2) {
  Curve.call(this);

  this.type = "LineCurve";

  this.v1 = v1 || new Vector2();
  this.v2 = v2 || new Vector2();
}

LineCurve.prototype = Object.create(Curve.prototype);
LineCurve.prototype.constructor = LineCurve;

LineCurve.prototype.isLineCurve = true;

/**
 * 一般曲线生成采用参数化形式表示，因此t在[0,1]之间可以与曲线点一一映射
 */
LineCurve.prototype.getPoint = function(t, optionalTarget) {
  var point = optionalTarget || new Vector2();

  // 当t为1，显然就是线段曲线的右端点
  if (t === 1) {
    point.copy(this.v2);
  } else {
    // 下面先计算线段向量，然后通过向量进行分量比例伸缩，最后转换为笛卡尔坐标系中的向量点
    point.copy(this.v2).sub(this.v1);
    point.multiplyScalar(t).add(this.v1);
  }

  return point;
};

//覆盖curve类默认的getPoint方法
LineCurve.prototype.getPointAt = function(u, optionalTarget) {
  return this.getPoint(u, optionalTarget);
};

// 得到线段的切向量
LineCurve.prototype.getTangent = function() {
  var tangent = this.v2.clone().sub(this.v1);

  return tangent.normalize();
};

LineCurve.prototype.copy = function(source) {
  Curve.prototype.copy.call(this, source);

  this.v1.copy(source.v1);
  this.v2.copy(source.v2);

  return this;
};

LineCurve.prototype.toJSON = function() {
  var data = Curve.prototype.toJSON.call(this);

  data.v1 = this.v1.toArray();
  data.v2 = this.v2.toArray();

  return data;
};

LineCurve.prototype.fromJSON = function(json) {
  Curve.prototype.fromJSON.call(this, json);

  this.v1.fromArray(json.v1);
  this.v2.fromArray(json.v2);

  return this;
};

export { LineCurve };
