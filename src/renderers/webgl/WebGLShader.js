/**
 *
 * @param {*} string 着色器代码片段
 */
function addLineNumbers(string) {
  var lines = string.split("\n");

  for (var i = 0; i < lines.length; i++) {
    lines[i] = i + 1 + ": " + lines[i];
  }

  return lines.join("\n");
}

/**
 *
 * @param {*} gl WebGL渲染上下文对象
 * @param {*} type 判定是顶点着色器还是片元着色器
 * @param {*} string 着色器字符串，这是WebGL最核心的部分
 */
function WebGLShader(gl, type, string) {
  // 创建着色器并编译
  var shader = gl.createShader(type);
  gl.shaderSource(shader, string);
  gl.compileShader(shader);

  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) === false) {
    console.error("THREE.WebGLShader: Shader couldn't compile.");
  }

  if (gl.getShaderInfoLog(shader) !== "") {
    console.warn(
      "THREE.WebGLShader: gl.getShaderInfoLog()",
      type === gl.VERTEX_SHADER ? "vertex" : "fragment",
      gl.getShaderInfoLog(shader),
      addLineNumbers(string)
    );
  }

  return shader;
}

export { WebGLShader };
