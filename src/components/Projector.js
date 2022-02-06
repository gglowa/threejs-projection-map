import * as THREE from "three";

export const vertexShader = `

  uniform mat4 viewMatrixCamera;
  uniform mat4 projectionMatrixCamera;
  uniform mat4 modelMatrixCamera;

  varying vec4 vWorldPosition;
  varying vec3 vNormal;
  varying vec4 vTexCoords;
  varying vec2 vUv;
  

  void main()
    {
    vUv = uv;
    
    vNormal = mat3(modelMatrix) * normal;
    vWorldPosition = modelMatrix * vec4(position, 1.0);
    vTexCoords = projectionMatrixCamera * viewMatrixCamera * vWorldPosition;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

   }
  `
//
export const fragmentShader = `

  uniform vec3 color;
  uniform vec3 pColor;
  uniform sampler2D pImage;
  uniform vec3 projectorPosition;
  uniform float tStrength;

  varying vec3 vNormal;
  varying vec4 vWorldPosition;
  varying vec4 vTexCoords;
  varying vec2 vUv;

  void main()
   {
    vec2 vUv = (vTexCoords.xy / vTexCoords.w) * 0.5 + 0.5;
    vec3 projectorDirection = normalize(projectorPosition - vWorldPosition.xyz);
    
    float dotProduct = dot(vNormal, projectorDirection);
    
    vec4 tColor = texture(pImage, vUv);
    vec4 pColor = vec4(pColor, 1.0);

    if (dotProduct < 0.0) {
      tColor = vec4(color, 1.0);
      pColor = vec4(color, 1.0);
    }
  
    gl_FragColor = vec4(mix(tColor.rgb, pColor.rgb, tStrength), 1.0);
  
  }
`

export class Projector {
  
  constructor(projectorParams, projectorMesh) {
    
    this.projectorCamera = new THREE.PerspectiveCamera(25, 1, 0.1, 10);
    this.projectorCamera.position.set(0, 0, -10);
    
    this.projectorCone = new THREE.CameraHelper(this.projectorCamera)
    scene.add(this.projectorCone)
    
    this.projectorModel = projectorMesh.clone();
    this.projectorModel.position.copy(this.projectorCamera.position)
    scene.add(this.projectorModel);
    
    this.uniforms = {
      color: {type: 'vec3', value: new THREE.Color(0x999999)},
      pColor: {type: 'vec3', value: new THREE.Color(0xFFF000)},
      pImage: {type: 't', value: null},
      tStrength: {type: 't', value: 0.0},
      viewMatrixCamera: {type: 'm4', value: null},
      projectionMatrixCamera: {type: 'm4', value: null},
      modelMatrixCamera: {type: 'm4', value: null},
      projectorPosition: {type: 'm4', value: null}
    }
    
    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    
    this.shaderMaterial.uniforms.pImage.value = projectorParams.projectionTexture[0];
  }
  
  update(params) {
    
    this.projectorCamera.position.set(params.projectorX, params.projectorY, params.projectorZ);
    this.projectorModel.position.copy(this.projectorCamera.position);
    this.projectorModel.lookAt(0, 0, 0);
  
    this.projectorCamera.fov = params.fov;
    this.projectorCone.update();
    
    this.shaderMaterial.uniforms.tStrength.value = params.texLight;
    
    this.projectorCamera.lookAt(0, 0, 0);
    this.projectorCamera.updateProjectionMatrix();
    this.projectorCamera.updateMatrixWorld();
    this.projectorCamera.updateWorldMatrix();
    
    this.shaderMaterial.uniforms.viewMatrixCamera.value = this.projectorCamera.matrixWorldInverse.clone();
    this.shaderMaterial.uniforms.projectionMatrixCamera.value = this.projectorCamera.projectionMatrix.clone();
    this.shaderMaterial.uniforms.modelMatrixCamera.value = this.projectorCamera.matrixWorld.clone();
    this.shaderMaterial.uniforms.projectorPosition.value = this.projectorCamera.position.clone();
    
  }
  
}
