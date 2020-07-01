import { Color } from '../../math/Color.js';
import { Vector2 } from '../../math/Vector2.js';
import { Matrix3 } from '../../math/Matrix3.js';

/**
 * Uniforms library for shared webgl shaders
 */

var UniformsLib = {

	common: {
        // 散射光照颜色，注意在着色时模型最终颜色与光线颜色、表面基地色相关
		diffuse: { value: new Color( 0xeeeeee ) },

		//所谓透明度的处理，其实就是对前景色和背景色的比例融合
		opacity: { value: 1.0 },

		//纹理以及纹理的UV映射过程
		map: { value: null },
		uvTransform: { value: new Matrix3() },

		// alpha通道纹理
		alphaMap: { value: null },
	},

	specularmap: {
        //镜面纹理
		specularMap: { value: null },

	},

	envmap: {
        //环境纹理，比如游戏中对环境的镜面反射
		envMap: { value: null },
		flipEnvMap: { value: - 1 },

		// 反射系数设置，符合菲涅尔光学
		reflectivity: { value: 1.0 },
		refractionRatio: { value: 0.98 },
		maxMipLevel: { value: 0 }

	},

	aomap: {

		aoMap: { value: null },
		aoMapIntensity: { value: 1 }

	},

	lightmap: {

		lightMap: { value: null },
		lightMapIntensity: { value: 1 }

	},

	emissivemap: {
        //自发光贴图
		emissiveMap: { value: null }

	},

	bumpmap: {
        //可形成表面凹凸效果的贴图
		bumpMap: { value: null },
		bumpScale: { value: 1 }

	},

	normalmap: {
        // 法向量贴图，可以在不同视角下形成清晰的贴图效果
		normalMap: { value: null },
		normalScale: { value: new Vector2( 1, 1 ) }

	},

	displacementmap: {
        //比bump贴图清晰度高
		displacementMap: { value: null },
		displacementScale: { value: 1 },
		displacementBias: { value: 0 }

	},

	roughnessmap: {

		roughnessMap: { value: null }

	},

	metalnessmap: {

		metalnessMap: { value: null }

	},

	gradientmap: {

		gradientMap: { value: null }

	},

	fog: {
        // 雾化效果，
		fogDensity: { value: 0.00025 },
		fogNear: { value: 1 },
		fogFar: { value: 2000 },
		fogColor: { value: new Color( 0xffffff ) }

	},

	lights: {
        //环境光、直射光、聚光灯、点光源、球面光等
		ambientLightColor: { value: [] },

		directionalLights: { value: [], properties: {
			direction: {},
			color: {},

			shadow: {},
			shadowBias: {},
			shadowRadius: {},
			shadowMapSize: {}
		} },

		directionalShadowMap: { value: [] },
		directionalShadowMatrix: { value: [] },

		spotLights: { value: [], properties: {
			color: {},
			position: {},
			direction: {},
			distance: {},
			coneCos: {},
			penumbraCos: {},
			decay: {},

			shadow: {},
			shadowBias: {},
			shadowRadius: {},
			shadowMapSize: {}
		} },

		spotShadowMap: { value: [] },
		spotShadowMatrix: { value: [] },

		pointLights: { value: [], properties: {
			color: {},
			position: {},
			decay: {},
			distance: {},

			shadow: {},
			shadowBias: {},
			shadowRadius: {},
			shadowMapSize: {},
			shadowCameraNear: {},
			shadowCameraFar: {}
		} },

		pointShadowMap: { value: [] },
		pointShadowMatrix: { value: [] },

		hemisphereLights: { value: [], properties: {
			direction: {},
			skyColor: {},
			groundColor: {}
		} },

		// TODO (abelnation): RectAreaLight BRDF data needs to be moved from example to main src
		rectAreaLights: { value: [], properties: {
			color: {},
			position: {},
			width: {},
			height: {}
		} }

	},

	points: {

		diffuse: { value: new Color( 0xeeeeee ) },
		opacity: { value: 1.0 },
		size: { value: 1.0 },
		scale: { value: 1.0 },
		map: { value: null },
		uvTransform: { value: new Matrix3() }

	}

};

export { UniformsLib };
