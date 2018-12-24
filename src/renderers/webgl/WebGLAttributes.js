/**
 *
 * @param {*} gl 表示底层的WEbGL上下文对象
 */
function WebGLAttributes(gl) {
  var buffers = new WeakMap();

  function createBuffer(attribute, bufferType) {
    var array = attribute.array;
    var usage = attribute.dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;

    // WebGL绘制的基本步骤
    /**
     * （1）创建内存缓冲
     * （2）将buffer缓冲对象与gl内置的bufferType常量绑定
     * （3）向buffer缓冲写入数据
     */
    var buffer = gl.createBuffer();

    gl.bindBuffer(bufferType, buffer);
    gl.bufferData(bufferType, array, usage);

    // 当属性数据加载完毕的回调
    attribute.onUploadCallback();

    var type = gl.FLOAT;

    // 将ES的数值类型转换为WEbGL内置的数值类型
    if (array instanceof Float32Array) {
      type = gl.FLOAT;
    } else if (array instanceof Float64Array) {
      console.warn(
        "THREE.WebGLAttributes: Unsupported data buffer format: Float64Array."
      );
    } else if (array instanceof Uint16Array) {
      type = gl.UNSIGNED_SHORT;
    } else if (array instanceof Int16Array) {
      type = gl.SHORT;
    } else if (array instanceof Uint32Array) {
      type = gl.UNSIGNED_INT;
    } else if (array instanceof Int32Array) {
      type = gl.INT;
    } else if (array instanceof Int8Array) {
      type = gl.BYTE;
    } else if (array instanceof Uint8Array) {
      type = gl.UNSIGNED_BYTE;
    }

    return {
      buffer: buffer,
      type: type,
      bytesPerElement: array.BYTES_PER_ELEMENT,
      version: attribute.version
    };
  }

  function updateBuffer(buffer, attribute, bufferType) {
    var array = attribute.array;
    var updateRange = attribute.updateRange;

    // 只有将buffer缓冲对象与GL内置的bufferType绑定后，才能进行后续操作
    gl.bindBuffer(bufferType, buffer);

    if (attribute.dynamic === false) {
      gl.bufferData(bufferType, array, gl.STATIC_DRAW);
    } else if (updateRange.count === -1) {
      // Not using update ranges

      gl.bufferSubData(bufferType, 0, array);
    } else if (updateRange.count === 0) {
      console.error(
        "THREE.WebGLObjects.updateBuffer: dynamic THREE.BufferAttribute marked as needsUpdate but updateRange.count is 0, ensure you are using set methods or updating manually."
      );
    } else {
      gl.bufferSubData(
        bufferType,
        updateRange.offset * array.BYTES_PER_ELEMENT,
        array.subarray(
          updateRange.offset,
          updateRange.offset + updateRange.count
        )
      );

      updateRange.count = -1; // reset range
    }
  }

  /**
   * 从WeakMap中根据属性名，得到对应数据
   * @param {*} attribute 属性数据，如果多个属性数据采样交叉存储，则进一步处理
   */
  function get(attribute) {
    if (attribute.isInterleavedBufferAttribute) attribute = attribute.data;

    return buffers.get(attribute);
  }

  //从WeakMap中根据属性名，删除对应数据
  function remove(attribute) {
    if (attribute.isInterleavedBufferAttribute) attribute = attribute.data;

    var data = buffers.get(attribute);

    if (data) {
      gl.deleteBuffer(data.buffer);

      buffers.delete(attribute);
    }
  }

  function update(attribute, bufferType) {
    if (attribute.isInterleavedBufferAttribute) attribute = attribute.data;

    var data = buffers.get(attribute);

    if (data === undefined) {
      buffers.set(attribute, createBuffer(attribute, bufferType));
    } else if (data.version < attribute.version) {
      updateBuffer(data.buffer, attribute, bufferType);

      data.version = attribute.version;
    }
  }

  return {
    get: get,
    remove: remove,
    update: update
  };
}

export { WebGLAttributes };
