import { Vector2 } from "../math/Vector2.js";

// 该构造函数用于将Geometry转换为BufferGeometry
function DirectGeometry() {
  // 几何模型由顶点、每个三角面法向量、每个顶点颜色
  // UV纹理映射坐标构成
  this.vertices = [];
  this.normals = [];
  this.colors = [];
  this.uvs = [];
  this.uvs2 = [];

  // 几何模型的分组，可以对一组几何模型进行变换。
  // 联想地月系统围绕太阳公转，以及月球围绕地球公转等
  this.groups = [];

  // 对于一些动画表现的增强
  this.morphTargets = {};

  // 皮肤纹理
  this.skinWeights = [];
  this.skinIndices = [];

  // 几何模型的包围盒和包围球，常用于模型碰撞检测
  this.boundingBox = null;
  this.boundingSphere = null;

  // 当几何模型属性发生变化，控制下面更新开关
  this.verticesNeedUpdate = false;
  this.normalsNeedUpdate = false;
  this.colorsNeedUpdate = false;
  this.uvsNeedUpdate = false;
  this.groupsNeedUpdate = false;
}

Object.assign(DirectGeometry.prototype, {
  computeGroups: function(geometry) {
    var group;
    var groups = [];
    var materialIndex = undefined;

    // 几何体模型的face数组，
    var faces = geometry.faces;

    // 每个face元素由一系列三角形组成
    for (var i = 0; i < faces.length; i++) {
      var face = faces[i];

      // 材质与纹理的差别在于，材质具有光照特性。
      if (face.materialIndex !== materialIndex) {
        materialIndex = face.materialIndex;

        if (group !== undefined) {
          group.count = i * 3 - group.start;
          groups.push(group);
        }

        group = {
          start: i * 3,
          materialIndex: materialIndex
        };
      }
    }

    if (group !== undefined) {
      group.count = i * 3 - group.start;
      groups.push(group);
    }

    this.groups = groups;
  },

  fromGeometry: function(geometry) {
    var faces = geometry.faces;
    var vertices = geometry.vertices;
    var faceVertexUvs = geometry.faceVertexUvs;

    var hasFaceVertexUv = faceVertexUvs[0] && faceVertexUvs[0].length > 0;
    var hasFaceVertexUv2 = faceVertexUvs[1] && faceVertexUvs[1].length > 0;

    // morphs

    var morphTargets = geometry.morphTargets;
    var morphTargetsLength = morphTargets.length;

    var morphTargetsPosition;

    if (morphTargetsLength > 0) {
      morphTargetsPosition = [];

      for (var i = 0; i < morphTargetsLength; i++) {
        morphTargetsPosition[i] = [];
      }

      this.morphTargets.position = morphTargetsPosition;
    }

    var morphNormals = geometry.morphNormals;
    var morphNormalsLength = morphNormals.length;

    var morphTargetsNormal;

    if (morphNormalsLength > 0) {
      morphTargetsNormal = [];

      for (var i = 0; i < morphNormalsLength; i++) {
        morphTargetsNormal[i] = [];
      }

      this.morphTargets.normal = morphTargetsNormal;
    }

    // skins

    var skinIndices = geometry.skinIndices;
    var skinWeights = geometry.skinWeights;

    var hasSkinIndices = skinIndices.length === vertices.length;
    var hasSkinWeights = skinWeights.length === vertices.length;

    //

    for (var i = 0; i < faces.length; i++) {
      var face = faces[i];

      this.vertices.push(vertices[face.a], vertices[face.b], vertices[face.c]);

      var vertexNormals = face.vertexNormals;

      if (vertexNormals.length === 3) {
        this.normals.push(vertexNormals[0], vertexNormals[1], vertexNormals[2]);
      } else {
        var normal = face.normal;

        this.normals.push(normal, normal, normal);
      }

      var vertexColors = face.vertexColors;

      if (vertexColors.length === 3) {
        this.colors.push(vertexColors[0], vertexColors[1], vertexColors[2]);
      } else {
        var color = face.color;

        this.colors.push(color, color, color);
      }

      if (hasFaceVertexUv === true) {
        var vertexUvs = faceVertexUvs[0][i];

        if (vertexUvs !== undefined) {
          this.uvs.push(vertexUvs[0], vertexUvs[1], vertexUvs[2]);
        } else {
          console.warn(
            "THREE.DirectGeometry.fromGeometry(): Undefined vertexUv ",
            i
          );

          this.uvs.push(new Vector2(), new Vector2(), new Vector2());
        }
      }

      if (hasFaceVertexUv2 === true) {
        var vertexUvs = faceVertexUvs[1][i];

        if (vertexUvs !== undefined) {
          this.uvs2.push(vertexUvs[0], vertexUvs[1], vertexUvs[2]);
        } else {
          console.warn(
            "THREE.DirectGeometry.fromGeometry(): Undefined vertexUv2 ",
            i
          );

          this.uvs2.push(new Vector2(), new Vector2(), new Vector2());
        }
      }

      // morphs

      for (var j = 0; j < morphTargetsLength; j++) {
        var morphTarget = morphTargets[j].vertices;

        morphTargetsPosition[j].push(
          morphTarget[face.a],
          morphTarget[face.b],
          morphTarget[face.c]
        );
      }

      for (var j = 0; j < morphNormalsLength; j++) {
        var morphNormal = morphNormals[j].vertexNormals[i];

        morphTargetsNormal[j].push(morphNormal.a, morphNormal.b, morphNormal.c);
      }

      // skins

      if (hasSkinIndices) {
        this.skinIndices.push(
          skinIndices[face.a],
          skinIndices[face.b],
          skinIndices[face.c]
        );
      }

      if (hasSkinWeights) {
        this.skinWeights.push(
          skinWeights[face.a],
          skinWeights[face.b],
          skinWeights[face.c]
        );
      }
    }

    this.computeGroups(geometry);

    this.verticesNeedUpdate = geometry.verticesNeedUpdate;
    this.normalsNeedUpdate = geometry.normalsNeedUpdate;
    this.colorsNeedUpdate = geometry.colorsNeedUpdate;
    this.uvsNeedUpdate = geometry.uvsNeedUpdate;
    this.groupsNeedUpdate = geometry.groupsNeedUpdate;

    return this;
  }
});

export { DirectGeometry };
