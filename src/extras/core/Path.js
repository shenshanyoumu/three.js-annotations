import { Vector2 } from "../../math/Vector2.js";
import { CurvePath } from "./CurvePath.js";
import { EllipseCurve } from "../curves/EllipseCurve.js";
import { SplineCurve } from "../curves/SplineCurve.js";
import { CubicBezierCurve } from "../curves/CubicBezierCurve.js";
import { QuadraticBezierCurve } from "../curves/QuadraticBezierCurve.js";
import { LineCurve } from "../curves/LineCurve.js";

/**
 * 根据控制点绘制路径曲线，可以联想canvas/SVG对应的基本图元
 * @param {*} points 控制点数组
 */
function Path(points) {
  CurvePath.call(this);

  this.type = "Path";

  this.currentPoint = new Vector2();

  if (points) {
    this.setFromPoints(points);
  }
}

Path.prototype = Object.assign(Object.create(CurvePath.prototype), {
  constructor: Path,

  setFromPoints: function(points) {
    this.moveTo(points[0].x, points[0].y);

    for (var i = 1, l = points.length; i < l; i++) {
      this.lineTo(points[i].x, points[i].y);
    }
  },

  // canvas中的moveTo，SVG中有对应的指令
  moveTo: function(x, y) {
    this.currentPoint.set(x, y);
  },

  lineTo: function(x, y) {
    var curve = new LineCurve(this.currentPoint.clone(), new Vector2(x, y));
    this.curves.push(curve);

    this.currentPoint.set(x, y);
  },

  // 二次曲线
  quadraticCurveTo: function(aCPx, aCPy, aX, aY) {
    var curve = new QuadraticBezierCurve(
      this.currentPoint.clone(),
      new Vector2(aCPx, aCPy),
      new Vector2(aX, aY)
    );

    this.curves.push(curve);

    this.currentPoint.set(aX, aY);
  },

  // 贝塞尔曲线
  bezierCurveTo: function(aCP1x, aCP1y, aCP2x, aCP2y, aX, aY) {
    var curve = new CubicBezierCurve(
      this.currentPoint.clone(),
      new Vector2(aCP1x, aCP1y),
      new Vector2(aCP2x, aCP2y),
      new Vector2(aX, aY)
    );

    this.curves.push(curve);

    this.currentPoint.set(aX, aY);
  },

  /**
   * 样条曲线
   * @param {} pts 向量数组
   */
  splineThru: function(pts) {
    var npts = [this.currentPoint.clone()].concat(pts);

    var curve = new SplineCurve(npts);
    this.curves.push(curve);

    this.currentPoint.copy(pts[pts.length - 1]);
  },

  // 弧线绘制
  arc: function(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
    var x0 = this.currentPoint.x;
    var y0 = this.currentPoint.y;

    this.absarc(aX + x0, aY + y0, aRadius, aStartAngle, aEndAngle, aClockwise);
  },

  absarc: function(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
    this.absellipse(
      aX,
      aY,
      aRadius,
      aRadius,
      aStartAngle,
      aEndAngle,
      aClockwise
    );
  },

  ellipse: function(
    aX,
    aY,
    xRadius,
    yRadius,
    aStartAngle,
    aEndAngle,
    aClockwise,
    aRotation
  ) {
    var x0 = this.currentPoint.x;
    var y0 = this.currentPoint.y;

    this.absellipse(
      aX + x0,
      aY + y0,
      xRadius,
      yRadius,
      aStartAngle,
      aEndAngle,
      aClockwise,
      aRotation
    );
  },

  absellipse: function(
    aX,
    aY,
    xRadius,
    yRadius,
    aStartAngle,
    aEndAngle,
    aClockwise,
    aRotation
  ) {
    var curve = new EllipseCurve(
      aX,
      aY,
      xRadius,
      yRadius,
      aStartAngle,
      aEndAngle,
      aClockwise,
      aRotation
    );

    if (this.curves.length > 0) {
      // if a previous curve is present, attempt to join
      var firstPoint = curve.getPoint(0);

      if (!firstPoint.equals(this.currentPoint)) {
        this.lineTo(firstPoint.x, firstPoint.y);
      }
    }

    this.curves.push(curve);

    var lastPoint = curve.getPoint(1);
    this.currentPoint.copy(lastPoint);
  },

  copy: function(source) {
    CurvePath.prototype.copy.call(this, source);

    this.currentPoint.copy(source.currentPoint);

    return this;
  },

  toJSON: function() {
    var data = CurvePath.prototype.toJSON.call(this);

    data.currentPoint = this.currentPoint.toArray();

    return data;
  },

  fromJSON: function(json) {
    CurvePath.prototype.fromJSON.call(this, json);

    this.currentPoint.fromArray(json.currentPoint);

    return this;
  }
});

export { Path };
