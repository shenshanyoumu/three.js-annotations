import { Object3D } from "../core/Object3D.js";
import { WebGLRenderTargetCube } from "../renderers/WebGLRenderTargetCube.js";
import { LinearFilter, RGBFormat } from "../constants.js";
import { Vector3 } from "../math/Vector3.js";
import { PerspectiveCamera } from "./PerspectiveCamera.js";

// 全景相机，用于在平行坐标轴的立体盒子中渲染整个3D场景
function CubeCamera(near, far, cubeResolution) {
  Object3D.call(this);

  this.type = "CubeCamera";

  var fov = 90, //视角为90，可以在立体盒子中心观察到整个平面
    aspect = 1;

  // 立方体盒子的六个平面都对应一个透视相机
  var cameraPX = new PerspectiveCamera(fov, aspect, near, far);
  cameraPX.up.set(0, -1, 0);
  cameraPX.lookAt(new Vector3(1, 0, 0));
  this.add(cameraPX);

  var cameraNX = new PerspectiveCamera(fov, aspect, near, far);
  cameraNX.up.set(0, -1, 0);
  cameraNX.lookAt(new Vector3(-1, 0, 0));
  this.add(cameraNX);

  var cameraPY = new PerspectiveCamera(fov, aspect, near, far);
  cameraPY.up.set(0, 0, 1);
  cameraPY.lookAt(new Vector3(0, 1, 0));
  this.add(cameraPY);

  var cameraNY = new PerspectiveCamera(fov, aspect, near, far);
  cameraNY.up.set(0, 0, -1);
  cameraNY.lookAt(new Vector3(0, -1, 0));
  this.add(cameraNY);

  var cameraPZ = new PerspectiveCamera(fov, aspect, near, far);
  cameraPZ.up.set(0, -1, 0);
  cameraPZ.lookAt(new Vector3(0, 0, 1));
  this.add(cameraPZ);

  var cameraNZ = new PerspectiveCamera(fov, aspect, near, far);
  cameraNZ.up.set(0, -1, 0);
  cameraNZ.lookAt(new Vector3(0, 0, -1));
  this.add(cameraNZ);

  var options = {
    format: RGBFormat,
    magFilter: LinearFilter,
    minFilter: LinearFilter
  };

  this.renderTarget = new WebGLRenderTargetCube(
    cubeResolution,
    cubeResolution,
    options
  );
  this.renderTarget.texture.name = "CubeCamera";

  this.update = function(renderer, scene) {
    if (this.parent === null) this.updateMatrixWorld();

    var renderTarget = this.renderTarget;
    var generateMipmaps = renderTarget.texture.generateMipmaps;

    renderTarget.texture.generateMipmaps = false;

    renderTarget.activeCubeFace = 0;
    renderer.render(scene, cameraPX, renderTarget);

    renderTarget.activeCubeFace = 1;
    renderer.render(scene, cameraNX, renderTarget);

    renderTarget.activeCubeFace = 2;
    renderer.render(scene, cameraPY, renderTarget);

    renderTarget.activeCubeFace = 3;
    renderer.render(scene, cameraNY, renderTarget);

    renderTarget.activeCubeFace = 4;
    renderer.render(scene, cameraPZ, renderTarget);

    renderTarget.texture.generateMipmaps = generateMipmaps;

    renderTarget.activeCubeFace = 5;
    renderer.render(scene, cameraNZ, renderTarget);

    renderer.setRenderTarget(null);
  };

  this.clear = function(renderer, color, depth, stencil) {
    var renderTarget = this.renderTarget;

    for (var i = 0; i < 6; i++) {
      renderTarget.activeCubeFace = i;
      renderer.setRenderTarget(renderTarget);

      renderer.clear(color, depth, stencil);
    }

    renderer.setRenderTarget(null);
  };
}

CubeCamera.prototype = Object.create(Object3D.prototype);
CubeCamera.prototype.constructor = CubeCamera;

export { CubeCamera };
