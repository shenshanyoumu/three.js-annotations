/**
 * @author mrdoob / http://mrdoob.com/
 */

function absNumericalSort(a, b) {
  return Math.abs(b[1]) - Math.abs(a[1]);
}

/**
 * morph主要用于模型的形变处理，
 * 在3D渲染中具有精细化的表面形变可以产生逼真的效果
 * morph或者skinn形变都是通过骨骼动画联动的
 * @param {*} gl
 */
function WebGLMorphtargets(gl) {
  var influencesList = {};
  var morphInfluences = new Float32Array(8);

  function update(object, geometry, material, program) {
    var objectInfluences = object.morphTargetInfluences;

    var length = objectInfluences.length;

    var influences = influencesList[geometry.id];

    if (influences === undefined) {
      influences = [];

      for (var i = 0; i < length; i++) {
        influences[i] = [i, 0];
      }

      influencesList[geometry.id] = influences;
    }

    var morphTargets =
      material.morphTargets && geometry.morphAttributes.position;
    var morphNormals = material.morphNormals && geometry.morphAttributes.normal;

    // 删除当前的形变属性
    for (var i = 0; i < length; i++) {
      var influence = influences[i];

      if (influence[1] !== 0) {
        if (morphTargets) geometry.removeAttribute("morphTarget" + i);
        if (morphNormals) geometry.removeAttribute("morphNormal" + i);
      }
    }

    // 收集模型中受形变影响的骨骼顶点结构
    for (var i = 0; i < length; i++) {
      var influence = influences[i];

      influence[0] = i;
      influence[1] = objectInfluences[i];
    }

    influences.sort(absNumericalSort);

    // 对受影响的骨骼添加形变属性
    for (var i = 0; i < 8; i++) {
      var influence = influences[i];

      if (influence) {
        var index = influence[0];
        var value = influence[1];

        if (value) {
          if (morphTargets)
            geometry.addAttribute("morphTarget" + i, morphTargets[index]);
          if (morphNormals)
            geometry.addAttribute("morphNormal" + i, morphNormals[index]);

          morphInfluences[i] = value;
          continue;
        }
      }

      morphInfluences[i] = 0;
    }

    program
      .getUniforms()
      .setValue(gl, "morphTargetInfluences", morphInfluences);
  }

  return {
    update: update
  };
}

export { WebGLMorphtargets };
