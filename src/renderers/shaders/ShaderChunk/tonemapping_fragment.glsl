#if defined( TONE_MAPPING )
  // toneMapping是实现HDR的技术，通过对片元颜色进行处理
  // 从而实现高动态范围光照效果。
  gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );

#endif
