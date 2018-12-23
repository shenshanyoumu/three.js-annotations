import { LightShadow } from "./LightShadow.js";
import { OrthographicCamera } from "../cameras/OrthographicCamera.js";

/**
 * @author mrdoob / http://mrdoob.com/
 */

/**
 * 具有阴影效果大的直线光照，模拟太阳光
 */
function DirectionalLightShadow() {
  // 之所以采样正交相机模型，就是在3D场景中模拟太阳光效果
  LightShadow.call(this, new OrthographicCamera(-5, 5, 5, -5, 0.5, 500));
}

DirectionalLightShadow.prototype = Object.assign(
  Object.create(LightShadow.prototype),
  {
    constructor: DirectionalLightShadow
  }
);

export { DirectionalLightShadow };
