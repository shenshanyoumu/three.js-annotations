float specularStrength;

#ifdef USE_SPECULARMAP
    //对镜面纹理采用UV坐标采样，形成纹素的镜面贴图对象
	vec4 texelSpecular = texture2D( specularMap, vUv );
	specularStrength = texelSpecular.r;

#else

	specularStrength = 1.0;

#endif