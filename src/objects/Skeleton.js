import { Matrix4 } from "../math/Matrix4.js";

// 骨架模型，注意区分与网格模型的差异
// 网格模型比骨架模型更加精细化，骨架模型主要关注模型的运动控制点，类似人的关节
function Skeleton(bones, boneInverses) {
  bones = bones || [];

  this.bones = bones.slice(0);
  this.boneMatrices = new Float32Array(this.bones.length * 16);

  // use the supplied bone inverses or calculate the inverses

  if (boneInverses === undefined) {
    this.calculateInverses();
  } else {
    if (this.bones.length === boneInverses.length) {
      this.boneInverses = boneInverses.slice(0);
    } else {
      console.warn("THREE.Skeleton boneInverses is the wrong length.");

      this.boneInverses = [];

      for (var i = 0, il = this.bones.length; i < il; i++) {
        this.boneInverses.push(new Matrix4());
      }
    }
  }
}

Object.assign(Skeleton.prototype, {
  calculateInverses: function() {
    this.boneInverses = [];

    for (var i = 0, il = this.bones.length; i < il; i++) {
      var inverse = new Matrix4();

      if (this.bones[i]) {
        inverse.getInverse(this.bones[i].matrixWorld);
      }

      this.boneInverses.push(inverse);
    }
  },

  pose: function() {
    var bone, i, il;

    // recover the bind-time world matrices

    for (i = 0, il = this.bones.length; i < il; i++) {
      bone = this.bones[i];

      if (bone) {
        bone.matrixWorld.getInverse(this.boneInverses[i]);
      }
    }

    // compute the local matrices, positions, rotations and scales

    for (i = 0, il = this.bones.length; i < il; i++) {
      bone = this.bones[i];

      if (bone) {
        if (bone.parent && bone.parent.isBone) {
          bone.matrix.getInverse(bone.parent.matrixWorld);
          bone.matrix.multiply(bone.matrixWorld);
        } else {
          bone.matrix.copy(bone.matrixWorld);
        }

        bone.matrix.decompose(bone.position, bone.quaternion, bone.scale);
      }
    }
  },

  // 当模型发生形变，则真正的逻辑就是触发骨架变换矩阵的更新
  update: (function() {
    var offsetMatrix = new Matrix4();
    var identityMatrix = new Matrix4();

    return function update() {
      var bones = this.bones;
      var boneInverses = this.boneInverses;
      var boneMatrices = this.boneMatrices;
      var boneTexture = this.boneTexture;

      // flatten bone matrices to array

      for (var i = 0, il = bones.length; i < il; i++) {
        // compute the offset between the current and the original transform

        var matrix = bones[i] ? bones[i].matrixWorld : identityMatrix;

        offsetMatrix.multiplyMatrices(matrix, boneInverses[i]);
        offsetMatrix.toArray(boneMatrices, i * 16);
      }

      if (boneTexture !== undefined) {
        boneTexture.needsUpdate = true;
      }
    };
  })(),

  clone: function() {
    return new Skeleton(this.bones, this.boneInverses);
  },

  // 骨架模型中，每个控制点都具有名称
  getBoneByName: function(name) {
    for (var i = 0, il = this.bones.length; i < il; i++) {
      var bone = this.bones[i];

      if (bone.name === name) {
        return bone;
      }
    }

    return undefined;
  }
});

export { Skeleton };
