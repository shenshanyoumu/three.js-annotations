#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP )
    // 将模型局部坐标系转换为世界坐标系
	vec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );

#endif
