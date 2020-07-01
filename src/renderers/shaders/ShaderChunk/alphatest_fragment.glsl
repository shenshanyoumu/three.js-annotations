#ifdef ALPHATEST
     // 颜色alpha通道检测，discard关键字表示对片元进行丢弃处理
	 // 即不参与后续计算
	if ( diffuseColor.a < ALPHATEST ) discard;

#endif
