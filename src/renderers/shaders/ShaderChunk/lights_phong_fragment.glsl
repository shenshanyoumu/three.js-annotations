BlinnPhongMaterial material;

//Blinn-Phong冯氏高光，可以根据表面法向量和观察者角度来渲染
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;
