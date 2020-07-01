/**
 * @author mrdoob / http://mrdoob.com/
 */

import { Matrix4 } from "../../math/Matrix4.js";
import { Vector4 } from "../../math/Vector4.js";
import { Vector3 } from "../../math/Vector3.js";

//四元数用于坐标变换
import { Quaternion } from "../../math/Quaternion.js";

//阵列相机，可以降低模组厚度，一般手机使用阵列相机
import { ArrayCamera } from "../../cameras/ArrayCamera.js";

// 透视相机
import { PerspectiveCamera } from "../../cameras/PerspectiveCamera.js";

/**
 * Virtual Reality效果的渲染
 * @param {*} renderer 表示传入的渲染上下文对象
 */
function WebVRManager(renderer) {
  var scope = this;

  var device = null;

  // 当前帧数据
  var frameData = null;

  // 目标姿态数据
  var poseTarget = null;

  // 变换矩阵
  var standingMatrix = new Matrix4();
  var standingMatrixInverse = new Matrix4();

  // 判定浏览器是否原生支持VR相关属性
  if (typeof window !== "undefined" && "VRFrameData" in window) {
    frameData = new window.VRFrameData();
  }

  // 之所以进行矩阵逆运算，其实道理很简单。
  // 就是在VR中需要将屏幕中的输入转换为3D空间中的运动
  var matrixWorldInverse = new Matrix4();

  var tempQuaternion = new Quaternion();
  var tempPosition = new Vector3();

  // 基于两台透视相机和一台阵列相机构成VR效果
  var cameraL = new PerspectiveCamera();
  cameraL.bounds = new Vector4(0.0, 0.0, 0.5, 1.0);
  cameraL.layers.enable(1);

  var cameraR = new PerspectiveCamera();
  cameraR.bounds = new Vector4(0.5, 0.0, 0.5, 1.0);
  cameraR.layers.enable(2);

  var cameraVR = new ArrayCamera([cameraL, cameraR]);
  cameraVR.layers.enable(1);
  cameraVR.layers.enable(2);

  //
  var currentSize, currentPixelRatio;

  function onVRDisplayPresentChange() {
    if (device !== null && device.isPresenting) {
      var eyeParameters = device.getEyeParameters("left");
      var renderWidth = eyeParameters.renderWidth;
      var renderHeight = eyeParameters.renderHeight;

      currentPixelRatio = renderer.getPixelRatio();
      currentSize = renderer.getSize();

      renderer.setDrawingBufferSize(renderWidth * 2, renderHeight, 1);
    } else if (scope.enabled) {
      renderer.setDrawingBufferSize(
        currentSize.width,
        currentSize.height,
        currentPixelRatio
      );
    }
  }

  if (typeof window !== "undefined") {
    window.addEventListener(
      "vrdisplaypresentchange",
      onVRDisplayPresentChange,
      false
    );
  }

  this.enabled = false;
  this.userHeight = 1.6;

  // 具有VR特性的硬件设备
  this.getDevice = function() {
    return device;
  };

  this.setDevice = function(value) {
    if (value !== undefined) device = value;
  };

  this.setPoseTarget = function(object) {
    if (object !== undefined) poseTarget = object;
  };

  this.getCamera = function(camera) {
    if (device === null) return camera;

    device.depthNear = camera.near;
    device.depthFar = camera.far;

    device.getFrameData(frameData);

    var stageParameters = device.stageParameters;

    if (stageParameters) {
      standingMatrix.fromArray(stageParameters.sittingToStandingTransform);
    } else {
      standingMatrix.makeTranslation(0, scope.userHeight, 0);
    }

    var pose = frameData.pose;
    var poseObject = poseTarget !== null ? poseTarget : camera;

    // We want to manipulate poseObject by its position and quaternion components since users may rely on them.
    poseObject.matrix.copy(standingMatrix);
    poseObject.matrix.decompose(
      poseObject.position,
      poseObject.quaternion,
      poseObject.scale
    );

    if (pose.orientation !== null) {
      tempQuaternion.fromArray(pose.orientation);
      poseObject.quaternion.multiply(tempQuaternion);
    }

    if (pose.position !== null) {
      tempQuaternion.setFromRotationMatrix(standingMatrix);
      tempPosition.fromArray(pose.position);
      tempPosition.applyQuaternion(tempQuaternion);
      poseObject.position.add(tempPosition);
    }

    poseObject.updateMatrixWorld();

    if (device.isPresenting === false) return camera;

    //

    cameraL.near = camera.near;
    cameraR.near = camera.near;

    cameraL.far = camera.far;
    cameraR.far = camera.far;

    cameraVR.matrixWorld.copy(camera.matrixWorld);
    cameraVR.matrixWorldInverse.copy(camera.matrixWorldInverse);

    cameraL.matrixWorldInverse.fromArray(frameData.leftViewMatrix);
    cameraR.matrixWorldInverse.fromArray(frameData.rightViewMatrix);

    // TODO (mrdoob) Double check this code

    standingMatrixInverse.getInverse(standingMatrix);

    cameraL.matrixWorldInverse.multiply(standingMatrixInverse);
    cameraR.matrixWorldInverse.multiply(standingMatrixInverse);

    var parent = poseObject.parent;

    if (parent !== null) {
      matrixWorldInverse.getInverse(parent.matrixWorld);

      cameraL.matrixWorldInverse.multiply(matrixWorldInverse);
      cameraR.matrixWorldInverse.multiply(matrixWorldInverse);
    }

    // envMap and Mirror needs camera.matrixWorld

    cameraL.matrixWorld.getInverse(cameraL.matrixWorldInverse);
    cameraR.matrixWorld.getInverse(cameraR.matrixWorldInverse);

    cameraL.projectionMatrix.fromArray(frameData.leftProjectionMatrix);
    cameraR.projectionMatrix.fromArray(frameData.rightProjectionMatrix);

    // HACK (mrdoob)
    // https://github.com/w3c/webvr/issues/203

    cameraVR.projectionMatrix.copy(cameraL.projectionMatrix);

    //

    var layers = device.getLayers();

    if (layers.length) {
      var layer = layers[0];

      if (layer.leftBounds !== null && layer.leftBounds.length === 4) {
        cameraL.bounds.fromArray(layer.leftBounds);
      }

      if (layer.rightBounds !== null && layer.rightBounds.length === 4) {
        cameraR.bounds.fromArray(layer.rightBounds);
      }
    }

    return cameraVR;
  };

  this.getStandingMatrix = function() {
    return standingMatrix;
  };

  this.submitFrame = function() {
    if (device && device.isPresenting) device.submitFrame();
  };

  this.dispose = function() {
    if (typeof window !== "undefined") {
      window.removeEventListener(
        "vrdisplaypresentchange",
        onVRDisplayPresentChange
      );
    }
  };
}

export { WebVRManager };
