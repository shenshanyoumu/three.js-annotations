import { Object3D } from "../core/Object3D.js";

// 可以组成骨架模型的每一块骨头，用于控制骨架的运动
function Bone() {
  Object3D.call(this);

  this.type = "Bone";
}

Bone.prototype = Object.assign(Object.create(Object3D.prototype), {
  constructor: Bone,

  isBone: true
});

export { Bone };
