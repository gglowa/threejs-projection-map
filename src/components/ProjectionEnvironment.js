import * as THREE from "three";
import {GUI} from 'dat.gui'
import {Projector} from './Projector';

const ProjectionEnvironment = (controls, modelList, modelPrams, projectorParams, addToEventList) => {
  
  // -----------------------------------------------------------------
  // GUI
  
  const params = {
    projectorX: 0.0,
    projectorY: 0.0,
    projectorZ: -10.0,
    texLight:0.001,
    fov: 25,
  };
  
  const gui = new GUI({width: 245});
  
  const positionFolder = gui.addFolder('Projector Position')
  positionFolder.add(params, 'projectorX', -100, 100).name('Projector X');
  positionFolder.add(params, 'projectorY', -100, 100).name('Projectot Y');
  positionFolder.add(params, 'projectorZ', -100, 100).name('Projector Z');
  positionFolder.open();
  
  const fovFolder = gui.addFolder('Projector FOV');
  fovFolder.add(params, 'fov', 1, 120).name('FOV');
  fovFolder.open();
  
  const texLightFolder = gui.addFolder('Projector Tex / Light');
  texLightFolder.add(params, 'texLight', 0.0, 1.0).name('Tex / Light');
  texLightFolder.open();
  
  const guiContainer = document.getElementsByClassName('dg main')[0];
  guiContainer.onmouseover = function () {
    controls.enabled = false;
  };
  guiContainer.onmouseout = function () {
    controls.enabled = true;
  };
  
  //GUI END
  // -----------------------------------------------------------------

  
  const projEventList = [];
  let projectorMesh;
  let projEventListLength = 0;
  
  const initNewProjector = (projectorMesh) => {
    return new Projector(projectorParams, projectorMesh);
  }
  
  const initScene = () => {
    
    // proj mesh
    projectorMesh = modelPrams.projectorMesh;
    projectorMesh.material = projectorParams.projectorModelMaterial;
    
    // ------------------------------------------------------
    // create new projector
    // to-do - work / research - needed to produce multiple units here
    const projectorUnit = initNewProjector(projectorMesh);
    
    // tex enviro - for only one unit
    modelPrams.enviroModels.forEach((model) => {
      scene.add(model);
      model.material = projectorUnit.shaderMaterial
    });
    
    addToProjEventList(projectorUnit);
    
  }
  
  // add proj / projectors to update list
  const addToProjEventList = (event) => {
    projEventList.push(event);
    projEventListLength = projEventList.length;
  }
  
  // proj updater
  const update = () => {
    for (let n = 0; n < projEventListLength; n++) {
      projEventList[n].update(params);
    }
  }
  
  // init
  initScene();
  addToEventList(update);
}

export default ProjectionEnvironment
