import { Sphere } from "../math/Sphere.js";
import { Ray } from "../math/Ray.js";
import { Matrix4 } from "../math/Matrix4.js";
import { Object3D } from "../core/Object3D.js";
import { Vector3 } from "../math/Vector3.js";
import { PointsMaterial } from "../materials/PointsMaterial.js";
import { BufferGeometry } from "../core/BufferGeometry.js";

// 粒子系统
function Points(geometry, material) {
  // 下面这种形式等价于super()语法糖，其中Points类继承自Object3D
  Object3D.call(this);

  this.type = "Points";

  this.geometry = geometry !== undefined ? geometry : new BufferGeometry();
  this.material =
    material !== undefined
      ? material
      : new PointsMaterial({ color: Math.random() * 0xffffff });
}

Points.prototype = Object.assign(Object.create(Object3D.prototype), {
  constructor: Points,

  isPoints: true,

  // 注意在Object3D基类中，该射线抛射器方法未具体实现，因此每个具体的类需要实现这个方法
  raycast: (function() {
    var inverseMatrix = new Matrix4();
    var ray = new Ray();
    var sphere = new Sphere();

    /**
     * 参数raycaster是Raycaster实例对象
     * interests保存与射线相交的粒子对象
     */
    return function raycast(raycaster, intersects) {
      var object = this;
      var geometry = this.geometry;
      var matrixWorld = this.matrixWorld;
      var threshold = raycaster.params.Points.threshold;

      // 在碰撞测试中，经常采样包围盒方式进行第一次粗略计算
      // 如果与包围盒没有相交则一定不会与真实的模型发生相交
      if (geometry.boundingSphere === null) {
        geometry.computeBoundingSphere();
      }

      sphere.copy(geometry.boundingSphere);
      sphere.applyMatrix4(matrixWorld);
      sphere.radius += threshold;

      if (raycaster.ray.intersectsSphere(sphere) === false) return;

      inverseMatrix.getInverse(matrixWorld);
      ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);

      var localThreshold =
        threshold / ((this.scale.x + this.scale.y + this.scale.z) / 3);
      var localThresholdSq = localThreshold * localThreshold;
      var position = new Vector3();
      var intersectPoint = new Vector3();

      // 测试point是否与射线相交，由于point的尺度非常小因此需要设置一个相交检测阈值
      function testPoint(point, index) {
        var rayPointDistanceSq = ray.distanceSqToPoint(point);

        // 如果射线与测试point的距离小于相交阈值，则认为该射线与point相交
        if (rayPointDistanceSq < localThresholdSq) {
          ray.closestPointToPoint(point, intersectPoint);
          intersectPoint.applyMatrix4(matrixWorld);

          var distance = raycaster.ray.origin.distanceTo(intersectPoint);

          if (distance < raycaster.near || distance > raycaster.far) return;

          //
          intersects.push({
            distance: distance, //射线源点与给定point的距离
            distanceToRay: Math.sqrt(rayPointDistanceSq), //给定point与射线的距离
            point: intersectPoint.clone(), //发生相交的point对象
            index: index, //point点在points集中的索引
            face: null, //point显然没有face，而其他Object3D对象在发生相交时，一定有相交的面数据
            object: object
          });
        }
      }

      if (geometry.isBufferGeometry) {
        var index = geometry.index;
        var attributes = geometry.attributes;
        var positions = attributes.position.array;

        if (index !== null) {
          var indices = index.array;

          for (var i = 0, il = indices.length; i < il; i++) {
            var a = indices[i];

            position.fromArray(positions, a * 3);

            testPoint(position, a);
          }
        } else {
          for (var i = 0, l = positions.length / 3; i < l; i++) {
            position.fromArray(positions, i * 3);

            testPoint(position, i);
          }
        }
      } else {
        var vertices = geometry.vertices;

        for (var i = 0, l = vertices.length; i < l; i++) {
          testPoint(vertices[i], i);
        }
      }
    };
  })(),

  clone: function() {
    return new this.constructor(this.geometry, this.material).copy(this);
  }
});

export { Points };
