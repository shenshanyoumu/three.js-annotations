/**
 * @author Kaleb Murphy
 * @author Mugen87 / https://github.com/Mugen87
 */

import { Geometry } from "../core/Geometry.js";
import { BufferGeometry } from "../core/BufferGeometry.js";
import { Float32BufferAttribute } from "../core/BufferAttribute.js";
import { Vector2 } from "../math/Vector2.js";
import { Vector3 } from "../math/Vector3.js";

// RingGeometry

/**
 * 圆环几何体，注意下面定义可知圆环的切面不一定是完整的圆弧，可能只有一部分
 * @param {*} innerRadius 内环半径
 * @param {*} outerRadius 外环半径
 * @param {*} thetaSegments 环状圆弧分割数
 * @param {*} phiSegments 圆环切面，即圆弧几何的分割数
 * @param {*} thetaStart 圆环切面，即圆弧开始角度
 * @param {*} thetaLength 圆环切面，即圆弧旋转角度
 */
function RingGeometry(
  innerRadius,
  outerRadius,
  thetaSegments,
  phiSegments,
  thetaStart,
  thetaLength
) {
  Geometry.call(this);

  this.type = "RingGeometry";

  this.parameters = {
    innerRadius: innerRadius,
    outerRadius: outerRadius,
    thetaSegments: thetaSegments,
    phiSegments: phiSegments,
    thetaStart: thetaStart,
    thetaLength: thetaLength
  };

  this.fromBufferGeometry(
    new RingBufferGeometry(
      innerRadius,
      outerRadius,
      thetaSegments,
      phiSegments,
      thetaStart,
      thetaLength
    )
  );
  this.mergeVertices();
}

RingGeometry.prototype = Object.create(Geometry.prototype);
RingGeometry.prototype.constructor = RingGeometry;

// RingBufferGeometry

function RingBufferGeometry(
  innerRadius,
  outerRadius,
  thetaSegments,
  phiSegments,
  thetaStart,
  thetaLength
) {
  BufferGeometry.call(this);

  this.type = "RingBufferGeometry";

  this.parameters = {
    innerRadius: innerRadius,
    outerRadius: outerRadius,
    thetaSegments: thetaSegments,
    phiSegments: phiSegments,
    thetaStart: thetaStart,
    thetaLength: thetaLength
  };

  innerRadius = innerRadius || 0.5;
  outerRadius = outerRadius || 1;

  thetaStart = thetaStart !== undefined ? thetaStart : 0;
  thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;

  thetaSegments = thetaSegments !== undefined ? Math.max(3, thetaSegments) : 8;
  phiSegments = phiSegments !== undefined ? Math.max(1, phiSegments) : 1;

  // buffers

  var indices = [];
  var vertices = [];
  var normals = [];
  var uvs = [];

  // some helper variables

  var segment;
  var radius = innerRadius;
  var radiusStep = (outerRadius - innerRadius) / phiSegments;
  var vertex = new Vector3();
  var uv = new Vector2();
  var j, i;

  // generate vertices, normals and uvs

  for (j = 0; j <= phiSegments; j++) {
    for (i = 0; i <= thetaSegments; i++) {
      // values are generate from the inside of the ring to the outside

      segment = thetaStart + (i / thetaSegments) * thetaLength;

      // vertex

      vertex.x = radius * Math.cos(segment);
      vertex.y = radius * Math.sin(segment);

      vertices.push(vertex.x, vertex.y, vertex.z);

      // normal

      normals.push(0, 0, 1);

      // uv

      uv.x = (vertex.x / outerRadius + 1) / 2;
      uv.y = (vertex.y / outerRadius + 1) / 2;

      uvs.push(uv.x, uv.y);
    }

    // increase the radius for next row of vertices

    radius += radiusStep;
  }

  // indices

  for (j = 0; j < phiSegments; j++) {
    var thetaSegmentLevel = j * (thetaSegments + 1);

    for (i = 0; i < thetaSegments; i++) {
      segment = i + thetaSegmentLevel;

      var a = segment;
      var b = segment + thetaSegments + 1;
      var c = segment + thetaSegments + 2;
      var d = segment + 1;

      // faces

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  // build geometry

  this.setIndex(indices);
  this.addAttribute("position", new Float32BufferAttribute(vertices, 3));
  this.addAttribute("normal", new Float32BufferAttribute(normals, 3));
  this.addAttribute("uv", new Float32BufferAttribute(uvs, 2));
}

RingBufferGeometry.prototype = Object.create(BufferGeometry.prototype);
RingBufferGeometry.prototype.constructor = RingBufferGeometry;

export { RingGeometry, RingBufferGeometry };
