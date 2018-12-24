import { EllipseCurve } from "./EllipseCurve.js";

/**
 * 弧线
 * @param {*} aX 弧线的中心点X轴坐标
 * @param {*} aY 弧线的中心点Y轴坐标
 * @param {*} aRadius 弧线半径
 * @param {*} aStartAngle 弧线开始绘制角度
 * @param {*} aEndAngle 弧线结束绘制角度
 * @param {*} aClockwise 是否逆时针
 */
function ArcCurve(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
  EllipseCurve.call(
    this,
    aX,
    aY,
    aRadius,
    aRadius,
    aStartAngle,
    aEndAngle,
    aClockwise
  );

  this.type = "ArcCurve";
}

ArcCurve.prototype = Object.create(EllipseCurve.prototype);
ArcCurve.prototype.constructor = ArcCurve;

ArcCurve.prototype.isArcCurve = true;

export { ArcCurve };
