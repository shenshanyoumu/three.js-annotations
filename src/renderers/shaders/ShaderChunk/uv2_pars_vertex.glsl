#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )
    // attribute修饰的变量只能用于顶点着色器；而
	// varying用于顶点着色器和片元着色器间传递数据
	attribute vec2 uv2;
	varying vec2 vUv2;

#endif