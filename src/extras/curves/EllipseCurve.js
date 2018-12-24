import { Curve } from "../core/Curve.js";
import { Vector2 } from "../../math/Vector2.js";

/**
 * 椭圆曲线
 * @param {*} aX 椭圆中心坐标X
 * @param {*} aY 椭圆中心坐标Y
 * @param {*} xRadius 长半轴
 * @param {*} yRadius 短半轴
 * @param {*} aStartAngle 绘制起点角度
 * @param {*} aEndAngle 绘制结束角度
 * @param {*} aClockwise 是否逆时针
 * @param {*} aRotation 整个椭圆曲线在笛卡尔坐标系上的旋转操作
 */
function EllipseCurve(
  aX,
  aY,
  xRadius,
  yRadius,
  aStartAngle,
  aEndAngle,
  aClockwise,
  aRotation
) {
  Curve.call(this);

  this.type = "EllipseCurve";

  this.aX = aX || 0;
  this.aY = aY || 0;

  this.xRadius = xRadius || 1;
  this.yRadius = yRadius || 1;

  this.aStartAngle = aStartAngle || 0;
  this.aEndAngle = aEndAngle || 2 * Math.PI;

  this.aClockwise = aClockwise || false;

  this.aRotation = aRotation || 0;
}

EllipseCurve.prototype = Object.create(Curve.prototype);
EllipseCurve.prototype.constructor = EllipseCurve;

EllipseCurve.prototype.isEllipseCurve = true;

EllipseCurve.prototype.getPoint = function(t, optionalTarget) {
  var point = optionalTarget || new Vector2();

  var twoPi = Math.PI * 2;

  // 椭圆曲线的绘制弧度，因此注意椭圆曲线并不需要封闭
  var deltaAngle = this.aEndAngle - this.aStartAngle;

  // 表示绘制起点与终点几乎重合，即认为同一个点
  var samePoints = Math.abs(deltaAngle) < Number.EPSILON;

  //  确保deltaAngle在[0,2PI]之间，便于计算
  while (deltaAngle < 0) {
    deltaAngle += twoPi;
  }
  while (deltaAngle > twoPi) {
    deltaAngle -= twoPi;
  }

  // 当椭圆曲线起点和终点经过三角周期变化后重合，则需要下面细分
  if (deltaAngle < Number.EPSILON) {
    if (samePoints) {
      deltaAngle = 0;
    } else {
      deltaAngle = twoPi;
    }
  }

  if (this.aClockwise === true && !samePoints) {
    if (deltaAngle === twoPi) {
      deltaAngle = -twoPi;
    } else {
      deltaAngle = deltaAngle - twoPi;
    }
  }

  var angle = this.aStartAngle + t * deltaAngle;

  // 这是椭圆曲线的数学表达形式
  var x = this.aX + this.xRadius * Math.cos(angle);
  var y = this.aY + this.yRadius * Math.sin(angle);

  // 当椭圆曲线本身在笛卡尔坐标系存在旋转操作，则对曲线极点和曲线上的点进行旋转操作
  if (this.aRotation !== 0) {
    var cos = Math.cos(this.aRotation);
    var sin = Math.sin(this.aRotation);

    var tx = x - this.aX;
    var ty = y - this.aY;

    x = tx * cos - ty * sin + this.aX;
    y = tx * sin + ty * cos + this.aY;
  }

  return point.set(x, y);
};

EllipseCurve.prototype.copy = function(source) {
  Curve.prototype.copy.call(this, source);

  this.aX = source.aX;
  this.aY = source.aY;

  this.xRadius = source.xRadius;
  this.yRadius = source.yRadius;

  this.aStartAngle = source.aStartAngle;
  this.aEndAngle = source.aEndAngle;

  this.aClockwise = source.aClockwise;

  this.aRotation = source.aRotation;

  return this;
};

EllipseCurve.prototype.toJSON = function() {
  var data = Curve.prototype.toJSON.call(this);

  data.aX = this.aX;
  data.aY = this.aY;

  data.xRadius = this.xRadius;
  data.yRadius = this.yRadius;

  data.aStartAngle = this.aStartAngle;
  data.aEndAngle = this.aEndAngle;

  data.aClockwise = this.aClockwise;

  data.aRotation = this.aRotation;

  return data;
};

EllipseCurve.prototype.fromJSON = function(json) {
  Curve.prototype.fromJSON.call(this, json);

  this.aX = json.aX;
  this.aY = json.aY;

  this.xRadius = json.xRadius;
  this.yRadius = json.yRadius;

  this.aStartAngle = json.aStartAngle;
  this.aEndAngle = json.aEndAngle;

  this.aClockwise = json.aClockwise;

  this.aRotation = json.aRotation;

  return this;
};

export { EllipseCurve };
