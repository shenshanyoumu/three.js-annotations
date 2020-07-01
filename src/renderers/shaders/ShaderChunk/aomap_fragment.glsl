#ifdef USE_AOMAP

	// frustum culling表示对视椎体外部模型进行剔除；而occlusion表示对视椎体内部遮挡部分模型
	//进行剔除。aoMap表示环境闭塞贴图
	float ambientOcclusion = ( texture2D( aoMap, vUv2 ).r - 1.0 ) * aoMapIntensity + 1.0;

    // 散射过程，是光线在模型表面微小的镜面反射的整体效果
	reflectedLight.indirectDiffuse *= ambientOcclusion;

	#if defined( USE_ENVMAP ) && defined( PHYSICAL )

		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );

		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.specularRoughness );

	#endif

#endif
