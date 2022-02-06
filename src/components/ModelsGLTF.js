import * as THREE from "three";
//
const ModelsGLTF = (models, scene, listCallBk) => {
  
  const modelPrams = {
    enviroModels: [],
    enviroMaterial: null,
    projectorMesh: null,
    projectorMaterial: null,
  }
  
  const modelList = [];
  let model;
  
  models.traverse((obj) => {
    
    if (obj.type === 'Mesh') {
      
      model = obj;
      const chkModel = model.name.split('_')
      
      if (chkModel[1] === 'enviro') {
        
        model.castShadow = true;
        model.receiveShadow = true;
        
        modelPrams.enviroModels.push(model)
        modelPrams.enviroMaterial = model.material;
      }
      
      if (chkModel[0] === 'projector') {
        modelPrams.projectorMesh = model;
        modelPrams.projectorMaterial = model.material;
      }
    }
    
    modelList.push(obj);
    
  });
  
  listCallBk([modelList, modelPrams]);
  
}
export default ModelsGLTF;
