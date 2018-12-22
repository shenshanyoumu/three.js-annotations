import { Object3D } from "../core/Object3D.js";

// 3D场景中，有时候需要控制一组模型的统一运动，因此采样group结构
// 比如模拟太阳系星球运动，则当围绕太阳运动时，地球和月球作为一个group处理；
function Group() {
  Object3D.call(this);

  this.type = "Group";
}

Group.prototype = Object.assign(Object.create(Object3D.prototype), {
  constructor: Group,

  isGroup: true
});

export { Group };
