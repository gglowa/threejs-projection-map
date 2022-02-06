import * as THREE from "three";
//
const ModelsGLTF = (models, listCallBk) => {
  
  const modelList = [];
  
  models.traverse((obj) => {
    
    if (obj.type === 'Mesh') {
      modelList.push(obj);
    }
  });
  
  listCallBk(modelList);
  
}
export default ModelsGLTF;
