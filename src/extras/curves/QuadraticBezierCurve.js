import { Curve } from "../core/Curve.js";
import { QuadraticBezier } from "../core/Interpolations.js";
import { Vector2 } from "../../math/Vector2.js";

/**
 * 二次贝塞尔曲线
 * @param {*} v0 曲线开始端点
 * @param {*} v1 控制点
 * @param {*} v2 曲线结束端点
 */
function QuadraticBezierCurve(v0, v1, v2) {
  Curve.call(this);

  this.type = "QuadraticBezierCurve";

  this.v0 = v0 || new Vector2();
  this.v1 = v1 || new Vector2();
  this.v2 = v2 || new Vector2();
}

QuadraticBezierCurve.prototype = Object.create(Curve.prototype);
QuadraticBezierCurve.prototype.constructor = QuadraticBezierCurve;

QuadraticBezierCurve.prototype.isQuadraticBezierCurve = true;

/**
 * 曲线方程一般采样参数化表示，因此t属于[0,1]可以与曲线上的点一一映射
 */
QuadraticBezierCurve.prototype.getPoint = function(t, optionalTarget) {
  var point = optionalTarget || new Vector2();

  var v0 = this.v0,
    v1 = this.v1,
    v2 = this.v2;

  point.set(
    QuadraticBezier(t, v0.x, v1.x, v2.x),
    QuadraticBezier(t, v0.y, v1.y, v2.y)
  );

  return point;
};

QuadraticBezierCurve.prototype.copy = function(source) {
  Curve.prototype.copy.call(this, source);

  this.v0.copy(source.v0);
  this.v1.copy(source.v1);
  this.v2.copy(source.v2);

  return this;
};

QuadraticBezierCurve.prototype.toJSON = function() {
  var data = Curve.prototype.toJSON.call(this);

  data.v0 = this.v0.toArray();
  data.v1 = this.v1.toArray();
  data.v2 = this.v2.toArray();

  return data;
};

QuadraticBezierCurve.prototype.fromJSON = function(json) {
  Curve.prototype.fromJSON.call(this, json);

  this.v0.fromArray(json.v0);
  this.v1.fromArray(json.v1);
  this.v2.fromArray(json.v2);

  return this;
};

export { QuadraticBezierCurve };
