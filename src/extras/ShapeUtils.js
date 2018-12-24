/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

import { Earcut } from "./Earcut.js";

/**
 * shape图形对象辅助方法
 */
var ShapeUtils = {
  // 计算凸包面积，很简单利用图形的三角划分计算每个三角形面积再累加
  area: function(contour) {
    var n = contour.length;
    var a = 0.0;

    for (var p = n - 1, q = 0; q < n; p = q++) {
      a += contour[p].x * contour[q].y - contour[q].x * contour[p].y;
    }

    return a * 0.5;
  },

  // 在数学积分领域，曲线是具有方向性的。
  isClockWise: function(pts) {
    return ShapeUtils.area(pts) < 0;
  },

  /**
   * shape实例的三角化处理，则需要分别存储所有顶点，以及组成三角面的顶点索引。如果shape存在镂空部分，则另外记录镂空
   * @param {*} contour 图形实例的凸包数据
   * @param {*} holes 图形实例的镂空部分
   */
  triangulateShape: function(contour, holes) {
    //三角化处理后所有顶点集
    var vertices = [];

    // 镂空区域的顶点索引数组
    var holeIndices = [];

    // 类似[ [ a,b,d ], [ b,c,d ] ]形式的构成三角面的顶点索引集合
    var faces = [];

    // 删除重复的顶点
    removeDupEndPts(contour);

    // 将图形实例的凸包数据转存到顶点集中
    addContour(vertices, contour);

    var holeIndex = contour.length;

    // 删除镂空部分的重复点
    holes.forEach(removeDupEndPts);

    // 注意下面，holes数组存储的每个元素就是一个hole实例；而一个hole实例由多个控制点构成
    for (var i = 0; i < holes.length; i++) {
      holeIndices.push(holeIndex);
      holeIndex += holes[i].length;
      addContour(vertices, holes[i]);
    }

    // 镂空部分的三角剖分处理
    var triangles = Earcut.triangulate(vertices, holeIndices);

    //将经过三角化处理后的三角面输出
    for (var i = 0; i < triangles.length; i += 3) {
      faces.push(triangles.slice(i, i + 3));
    }

    return faces;
  }
};

// 封闭图形中，一般最后一个点与第一个点重合
function removeDupEndPts(points) {
  var l = points.length;

  if (l > 2 && points[l - 1].equals(points[0])) {
    points.pop();
  }
}

// 图形的凸包顶点集
function addContour(vertices, contour) {
  for (var i = 0; i < contour.length; i++) {
    vertices.push(contour[i].x);
    vertices.push(contour[i].y);
  }
}

export { ShapeUtils };
