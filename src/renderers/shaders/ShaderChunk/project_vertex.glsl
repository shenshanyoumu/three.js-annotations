// 模型视图矩阵将模型局部坐标转为相机空间
vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );

// 从相机空间转换为投影空间，投影空间即裁剪空间，是一种屏幕坐标的
// 中间形态
gl_Position = projectionMatrix * mvPosition;
