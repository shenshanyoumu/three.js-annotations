import { Line } from "./Line.js";

// 可以形成闭环结构的线段对象
function LineLoop(geometry, material) {
  Line.call(this, geometry, material);

  this.type = "LineLoop";
}

LineLoop.prototype = Object.assign(Object.create(Line.prototype), {
  constructor: LineLoop,

  isLineLoop: true
});

export { LineLoop };
