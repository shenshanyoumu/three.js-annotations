#ifdef USE_ALPHAMAP
    // texture2D 对纹理图像的二维UV坐标
	diffuseColor.a *= texture2D( alphaMap, vUv ).g;

#endif
