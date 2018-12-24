/**
 *
 * @param {*} geometries 模型的几何结构
 * @param {*} info 模型其他信息
 */
function WebGLObjects(geometries, info) {
  var updateList = {};

  function update(object) {
    var frame = info.render.frame;

    var geometry = object.geometry;
    var buffergeometry = geometries.get(object, geometry);

    // 每一帧渲染一次模型
    if (updateList[buffergeometry.id] !== frame) {
      if (geometry.isGeometry) {
        buffergeometry.updateFromObject(object);
      }

      geometries.update(buffergeometry);
      updateList[buffergeometry.id] = frame;
    }

    return buffergeometry;
  }

  function dispose() {
    updateList = {};
  }

  return {
    update: update,
    dispose: dispose
  };
}

export { WebGLObjects };
