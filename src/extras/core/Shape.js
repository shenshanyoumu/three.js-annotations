import { Path } from "./Path.js";
import { _Math } from "../../math/Math.js";

// STEP 1 Create a path.
// STEP 2 Turn path into shape.
// STEP 3 ExtrudeGeometry takes in Shape/Shapes
// STEP 3a - Extract points from each shape, turn to vertices
// STEP 3b - Triangulate each shape, add faces.

//
/**
 * 利用这个类可以创造任意路径的图形
 * @param {*} points 控制点数组
 * （1）创建一个path路径曲线对象
 * （2）将path路径曲线转换为shape对象
 * （3）将shape对象“充气”变成三维模型。其中分两步，第一步提取每个shape对象的点数据并转换为顶点；第二步利用顶点进行三角化处理，从而形成面
 */
function Shape(points) {
  Path.call(this, points);

  this.uuid = _Math.generateUUID();

  this.type = "Shape";

  // shape对象可能存在镂空的形态；注意数组每个元素其实就是path实例
  this.holes = [];
}

Shape.prototype = Object.assign(Object.create(Path.prototype), {
  constructor: Shape,

  //   得到形成holes的path对象的采样点
  getPointsHoles: function(divisions) {
    var holesPts = [];

    for (var i = 0, l = this.holes.length; i < l; i++) {
      holesPts[i] = this.holes[i].getPoints(divisions);
    }

    return holesPts;
  },

  //   采样shape曲线点，以及shape中存在的漏洞曲线点
  extractPoints: function(divisions) {
    return {
      shape: this.getPoints(divisions),
      holes: this.getPointsHoles(divisions)
    };
  },

  copy: function(source) {
    Path.prototype.copy.call(this, source);

    this.holes = [];

    for (var i = 0, l = source.holes.length; i < l; i++) {
      var hole = source.holes[i];

      this.holes.push(hole.clone());
    }

    return this;
  },

  toJSON: function() {
    var data = Path.prototype.toJSON.call(this);

    data.uuid = this.uuid;
    data.holes = [];

    for (var i = 0, l = this.holes.length; i < l; i++) {
      var hole = this.holes[i];
      data.holes.push(hole.toJSON());
    }

    return data;
  },

  fromJSON: function(json) {
    Path.prototype.fromJSON.call(this, json);

    this.uuid = json.uuid;
    this.holes = [];

    for (var i = 0, l = json.holes.length; i < l; i++) {
      var hole = json.holes[i];
      this.holes.push(new Path().fromJSON(hole));
    }

    return this;
  }
});

export { Shape };
