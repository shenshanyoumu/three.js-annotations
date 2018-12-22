import { Ray } from "../math/Ray.js";

//射线抛射器用于物体遮挡检测、碰撞检测等。
// 参数分为射线抛射器的起点、方向、以及与起点的远近点
function Raycaster(origin, direction, near, far) {
  // 构建测试射线
  this.ray = new Ray(origin, direction);

  this.near = near || 0;
  this.far = far || Infinity;

  this.params = {
    Mesh: {},
    Line: {},
    LOD: {},
    Points: { threshold: 1 },
    Sprite: {}
  };

  Object.defineProperties(this.params, {
    PointCloud: {
      get: function() {
        console.warn(
          "THREE.Raycaster: params.PointCloud has been renamed to params.Points."
        );
        return this.Points;
      }
    }
  });
}

// 基于距离进行降序排序
function ascSort(a, b) {
  return a.distance - b.distance;
}

// 递归判断与物体的相交
function intersectObject(object, raycaster, intersects, recursive) {
  if (object.visible === false) return;

  // 具体的Object类实现raycast方法
  object.raycast(raycaster, intersects);

  if (recursive === true) {
    var children = object.children;

    for (var i = 0, l = children.length; i < l; i++) {
      intersectObject(children[i], raycaster, intersects, true);
    }
  }
}

Object.assign(Raycaster.prototype, {
  linePrecision: 1,

  set: function(origin, direction) {
    // direction is assumed to be normalized (for accurate distance calculations)

    this.ray.set(origin, direction);
  },

  // 从相机视场中点来设置Raycaster
  setFromCamera: function(coords, camera) {
    if (camera && camera.isPerspectiveCamera) {
      this.ray.origin.setFromMatrixPosition(camera.matrixWorld);
      this.ray.direction
        .set(coords.x, coords.y, 0.5)
        .unproject(camera)
        .sub(this.ray.origin)
        .normalize();
    } else if (camera && camera.isOrthographicCamera) {
      this.ray.origin
        .set(
          coords.x,
          coords.y,
          (camera.near + camera.far) / (camera.near - camera.far)
        )
        .unproject(camera); // set origin in plane of camera
      this.ray.direction.set(0, 0, -1).transformDirection(camera.matrixWorld);
    } else {
      console.error("THREE.Raycaster: Unsupported camera type.");
    }
  },

  // 按与当前射线抛射器相交的距离的得到一系列相交的模型
  intersectObject: function(object, recursive, optionalTarget) {
    var intersects = optionalTarget || [];

    intersectObject(object, this, intersects, recursive);

    intersects.sort(ascSort);

    return intersects;
  },

  intersectObjects: function(objects, recursive, optionalTarget) {
    var intersects = optionalTarget || [];

    if (Array.isArray(objects) === false) {
      console.warn(
        "THREE.Raycaster.intersectObjects: objects is not an Array."
      );
      return intersects;
    }

    for (var i = 0, l = objects.length; i < l; i++) {
      intersectObject(objects[i], this, intersects, recursive);
    }

    // 按照相交点的距离来排序
    intersects.sort(ascSort);

    return intersects;
  }
});

export { Raycaster };
