import { Camera } from "./Camera.js";
import { Object3D } from "../core/Object3D.js";
import { _Math } from "../math/Math.js";

/**
 * 具有透视效果的相机，人类观察世界的最直观形式就是透视
 * @param {*} fov 可视角度
 * @param {*} aspect 投影宽长比
 * @param {*} near 近平面
 * @param {*} far 远平面
 */
function PerspectiveCamera(fov, aspect, near, far) {
  Camera.call(this);

  // 透视相机
  this.type = "PerspectiveCamera";

  // 默认的参数设置
  this.fov = fov !== undefined ? fov : 50;
  this.zoom = 1;

  this.near = near !== undefined ? near : 0.1;
  this.far = far !== undefined ? far : 2000;
  this.focus = 10;

  this.aspect = aspect !== undefined ? aspect : 1;
  this.view = null;

  // film即电影胶片，其实就是相机的幕布。
  // filmGauged表示胶片校准宽度为35毫米；
  // filmOffset表示胶片水平偏移量，即相机不改变标定参数而水平移动时产生的偏差
  this.filmGauge = 35;
  this.filmOffset = 0;

  //相机实例化时，更新3D场景在相机坐标系的投影
  this.updateProjectionMatrix();
}

PerspectiveCamera.prototype = Object.assign(Object.create(Camera.prototype), {
  constructor: PerspectiveCamera,

  isPerspectiveCamera: true,

  copy: function(source, recursive) {
    Camera.prototype.copy.call(this, source, recursive);

    this.fov = source.fov;
    this.zoom = source.zoom;

    this.near = source.near;
    this.far = source.far;
    this.focus = source.focus;

    this.aspect = source.aspect;
    this.view = source.view === null ? null : Object.assign({}, source.view);

    //
    this.filmGauge = source.filmGauge;
    this.filmOffset = source.filmOffset;

    return this;
  },

  // 针对35毫米的胶片尺寸设置焦距
  setFocalLength: function(focalLength) {
    // see http://www.bobatkins.com/photography/technical/field_of_view.html
    var vExtentSlope = (0.5 * this.getFilmHeight()) / focalLength;

    this.fov = _Math.RAD2DEG * 2 * Math.atan(vExtentSlope);
    this.updateProjectionMatrix();
  },

  /**
   * Calculates the focal length from the current .fov and .filmGauge.
   */
  getFocalLength: function() {
    var vExtentSlope = Math.tan(_Math.DEG2RAD * 0.5 * this.fov);

    return (0.5 * this.getFilmHeight()) / vExtentSlope;
  },

  getEffectiveFOV: function() {
    return (
      _Math.RAD2DEG *
      2 *
      Math.atan(Math.tan(_Math.DEG2RAD * 0.5 * this.fov) / this.zoom)
    );
  },

  //获得胶片宽度，注意胶片设置可以是portrait/landscape两种模式
  getFilmWidth: function() {
    // film not completely covered in portrait format (aspect < 1)
    return this.filmGauge * Math.min(this.aspect, 1);
  },

  // 得到胶片高度
  getFilmHeight: function() {
    return this.filmGauge / Math.max(this.aspect, 1);
  },

  /**
   * Sets an offset in a larger frustum. This is useful for multi-window or
   * multi-monitor/multi-machine setups.
   *
   * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
   * the monitors are in grid like this
   *
   *   +---+---+---+
   *   | A | B | C |
   *   +---+---+---+
   *   | D | E | F |
   *   +---+---+---+
   *
   * then for each monitor you would call it like this
   *
   *   var w = 1920;
   *   var h = 1080;
   *   var fullWidth = w * 3;
   *   var fullHeight = h * 2;
   *
   *   --A--
   *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
   *   --B--
   *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
   *   --C--
   *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
   *   --D--
   *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
   *   --E--
   *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
   *   --F--
   *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
   *
   *   Note there is no reason monitors have to be the same size or in a grid.
   */
  setViewOffset: function(fullWidth, fullHeight, x, y, width, height) {
    this.aspect = fullWidth / fullHeight;

    if (this.view === null) {
      this.view = {
        enabled: true,
        fullWidth: 1,
        fullHeight: 1,
        offsetX: 0,
        offsetY: 0,
        width: 1,
        height: 1
      };
    }

    this.view.enabled = true;
    this.view.fullWidth = fullWidth;
    this.view.fullHeight = fullHeight;
    this.view.offsetX = x;
    this.view.offsetY = y;
    this.view.width = width;
    this.view.height = height;

    this.updateProjectionMatrix();
  },

  clearViewOffset: function() {
    if (this.view !== null) {
      this.view.enabled = false;
    }

    this.updateProjectionMatrix();
  },

  //从世界坐标系经过投影变换得到相机坐标系中的投影
  updateProjectionMatrix: function() {
    var near = this.near,
      top = (near * Math.tan(_Math.DEG2RAD * 0.5 * this.fov)) / this.zoom,
      height = 2 * top,
      width = this.aspect * height,
      left = -0.5 * width,
      view = this.view;

    if (this.view !== null && this.view.enabled) {
      var fullWidth = view.fullWidth,
        fullHeight = view.fullHeight;

      left += (view.offsetX * width) / fullWidth;
      top -= (view.offsetY * height) / fullHeight;
      width *= view.width / fullWidth;
      height *= view.height / fullHeight;
    }

    var skew = this.filmOffset;
    if (skew !== 0) left += (near * skew) / this.getFilmWidth();

    this.projectionMatrix.makePerspective(
      left,
      left + width,
      top,
      top - height,
      near,
      this.far
    );
  },

  //JSON化相机对象
  toJSON: function(meta) {
    var data = Object3D.prototype.toJSON.call(this, meta);

    data.object.fov = this.fov;
    data.object.zoom = this.zoom;

    data.object.near = this.near;
    data.object.far = this.far;
    data.object.focus = this.focus;

    data.object.aspect = this.aspect;

    if (this.view !== null) {
      data.object.view = Object.assign({}, this.view);
    }

    data.object.filmGauge = this.filmGauge;
    data.object.filmOffset = this.filmOffset;

    return data;
  }
});

export { PerspectiveCamera };
