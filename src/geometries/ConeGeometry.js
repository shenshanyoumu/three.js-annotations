/**
 * @author abelnation / http://github.com/abelnation
 */

import { CylinderGeometry } from "./CylinderGeometry.js";
import { CylinderBufferGeometry } from "./CylinderGeometry.js";

// ConeGeometry

/**
 * 圆锥体
 * @param {*} radius 圆锥体底面半径
 * @param {*} height 圆锥体高度
 * @param {*} radialSegments 圆锥体底面圆弧分割数
 * @param {*} heightSegments 圆锥体高度分割数
 * @param {*} openEnded 表示圆锥体是否开闭
 * @param {*} thetaStart 如果圆锥体不封闭，则旋转开始角度
 * @param {*} thetaLength 旋转弧度
 */
function ConeGeometry(
  radius,
  height,
  radialSegments,
  heightSegments,
  openEnded,
  thetaStart,
  thetaLength
) {
  CylinderGeometry.call(
    this,
    0,
    radius,
    height,
    radialSegments,
    heightSegments,
    openEnded,
    thetaStart,
    thetaLength
  );

  this.type = "ConeGeometry";

  this.parameters = {
    radius: radius,
    height: height,
    radialSegments: radialSegments,
    heightSegments: heightSegments,
    openEnded: openEnded,
    thetaStart: thetaStart,
    thetaLength: thetaLength
  };
}

ConeGeometry.prototype = Object.create(CylinderGeometry.prototype);
ConeGeometry.prototype.constructor = ConeGeometry;

// ConeBufferGeometry

function ConeBufferGeometry(
  radius,
  height,
  radialSegments,
  heightSegments,
  openEnded,
  thetaStart,
  thetaLength
) {
  CylinderBufferGeometry.call(
    this,
    0,
    radius,
    height,
    radialSegments,
    heightSegments,
    openEnded,
    thetaStart,
    thetaLength
  );

  this.type = "ConeBufferGeometry";

  this.parameters = {
    radius: radius,
    height: height,
    radialSegments: radialSegments,
    heightSegments: heightSegments,
    openEnded: openEnded,
    thetaStart: thetaStart,
    thetaLength: thetaLength
  };
}

ConeBufferGeometry.prototype = Object.create(CylinderBufferGeometry.prototype);
ConeBufferGeometry.prototype.constructor = ConeBufferGeometry;

export { ConeGeometry, ConeBufferGeometry };
