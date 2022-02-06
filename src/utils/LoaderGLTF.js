import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

const LoaderGLTF = (model, loadedCallBk) => {

    const loader = new GLTFLoader();
    loader.load(
        model,
        (gltf) => {
            loadedCallBk(gltf.scene, gltf);
        },
        (xhr) => {
            console.log(`${(xhr.loaded / xhr.total * 100)}% loaded-1`);
        },
        (error) => {
            console.error('error', error);
        },
    );
};

export default LoaderGLTF;
