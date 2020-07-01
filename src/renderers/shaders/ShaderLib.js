
// 定义了大量内置的着色器片段
import { ShaderChunk } from "./ShaderChunk.js";

// 辅助工具，用于对着色器片段进行代码融合处理
import { UniformsUtils } from "./UniformsUtils.js";
import { Vector3 } from "../../math/Vector3.js";
import { UniformsLib } from "./UniformsLib.js";
import { Color } from "../../math/Color.js";

/**
 * 着色器处理库
 */
var ShaderLib = {
  // 基础着色对象，包括uniform修饰的变量、线框基础顶点着色器
  // 线框基础片元着色器
  basic: {
    uniforms: UniformsUtils.merge([
      UniformsLib.common,
      UniformsLib.specularmap,
      UniformsLib.envmap,
      UniformsLib.aomap,
      UniformsLib.lightmap,
      UniformsLib.fog
    ]),

    vertexShader: ShaderChunk.meshbasic_vert,
    fragmentShader: ShaderChunk.meshbasic_frag
  },

  //Lambert光照着色，
  lambert: {
    uniforms: UniformsUtils.merge([
      UniformsLib.common,
      UniformsLib.specularmap,
      UniformsLib.envmap,
      UniformsLib.aomap,
      UniformsLib.lightmap,
      UniformsLib.emissivemap,
      UniformsLib.fog,
      UniformsLib.lights,
      {
        // 自发光的光照颜色
        emissive: { value: new Color(0x000000) }
      }
    ]),

    vertexShader: ShaderChunk.meshlambert_vert,
    fragmentShader: ShaderChunk.meshlambert_frag
  },

  // phong光照效果
  phong: {
    uniforms: UniformsUtils.merge([
      UniformsLib.common,
      UniformsLib.specularmap,
      UniformsLib.envmap,
      UniformsLib.aomap,
      UniformsLib.lightmap,
      UniformsLib.emissivemap,
      UniformsLib.bumpmap,
      UniformsLib.normalmap,
      UniformsLib.displacementmap,
      UniformsLib.gradientmap,
      UniformsLib.fog,
      UniformsLib.lights,
      {
        emissive: { value: new Color(0x000000) },
        specular: { value: new Color(0x111111) },
        shininess: { value: 30 }
      }
    ]),

    vertexShader: ShaderChunk.meshphong_vert,
    fragmentShader: ShaderChunk.meshphong_frag
  },

  standard: {
    uniforms: UniformsUtils.merge([
      UniformsLib.common,
      UniformsLib.envmap,
      UniformsLib.aomap,
      UniformsLib.lightmap,
      UniformsLib.emissivemap,
      UniformsLib.bumpmap,
      UniformsLib.normalmap,
      UniformsLib.displacementmap,
      UniformsLib.roughnessmap,
      UniformsLib.metalnessmap,
      UniformsLib.fog,
      UniformsLib.lights,
      {
        emissive: { value: new Color(0x000000) },
        roughness: { value: 0.5 },
        metalness: { value: 0.5 },
        envMapIntensity: { value: 1 } // temporary
      }
    ]),

    vertexShader: ShaderChunk.meshphysical_vert,
    fragmentShader: ShaderChunk.meshphysical_frag
  },

  points: {
    uniforms: UniformsUtils.merge(
      [UniformsLib.points,
       UniformsLib.fog]),

    vertexShader: ShaderChunk.points_vert,
    fragmentShader: ShaderChunk.points_frag
  },

  dashed: {
    uniforms: UniformsUtils.merge([
      UniformsLib.common,
      UniformsLib.fog,
      {
        scale: { value: 1 },
        dashSize: { value: 1 },
        totalSize: { value: 2 }
      }
    ]),

    vertexShader: ShaderChunk.linedashed_vert,
    fragmentShader: ShaderChunk.linedashed_frag
  },

  // 深度着色
  depth: {
    uniforms: UniformsUtils.merge([
      UniformsLib.common,
      UniformsLib.displacementmap
    ]),

    vertexShader: ShaderChunk.depth_vert,
    fragmentShader: ShaderChunk.depth_frag
  },

  // 表面法向量着色对象
  normal: {
    uniforms: UniformsUtils.merge([
      UniformsLib.common,
      UniformsLib.bumpmap,
      UniformsLib.normalmap,
      UniformsLib.displacementmap,
      {
        opacity: { value: 1.0 }
      }
    ]),

    vertexShader: ShaderChunk.normal_vert,
    fragmentShader: ShaderChunk.normal_frag
  },

  cube: {
    uniforms: {
      tCube: { value: null },
      tFlip: { value: -1 },
      opacity: { value: 1.0 }
    },

    vertexShader: ShaderChunk.cube_vert,
    fragmentShader: ShaderChunk.cube_frag
  },

  equirect: {
    uniforms: {
      tEquirect: { value: null }
    },

    vertexShader: ShaderChunk.equirect_vert,
    fragmentShader: ShaderChunk.equirect_frag
  },

  distanceRGBA: {
    uniforms: UniformsUtils.merge([
      UniformsLib.common,
      UniformsLib.displacementmap,
      {
        referencePosition: { value: new Vector3() },
        nearDistance: { value: 1 },
        farDistance: { value: 1000 }
      }
    ]),

    vertexShader: ShaderChunk.distanceRGBA_vert,
    fragmentShader: ShaderChunk.distanceRGBA_frag
  },

  shadow: {
    uniforms: UniformsUtils.merge([
      UniformsLib.lights,
      UniformsLib.fog,
      {
        color: { value: new Color(0x00000) },
        opacity: { value: 1.0 }
      }
    ]),

    vertexShader: ShaderChunk.shadow_vert,
    fragmentShader: ShaderChunk.shadow_frag
  }
};

ShaderLib.physical = {
  uniforms: UniformsUtils.merge([
    ShaderLib.standard.uniforms,
    {
      clearCoat: { value: 0 },
      clearCoatRoughness: { value: 0 }
    }
  ]),

  vertexShader: ShaderChunk.meshphysical_vert,
  fragmentShader: ShaderChunk.meshphysical_frag
};

export { ShaderLib };
