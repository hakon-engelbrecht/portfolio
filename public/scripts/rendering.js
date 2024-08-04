import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

/**
 * Create the base for the scene
 * 
 * @returns {Object} scene, camera, renderer
 */
const createScene = () => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    document.getElementById('scene-container').appendChild(renderer.domElement);

    camera.position.z = 5;

    // background
    scene.background = null;

    return { scene, camera, renderer };
}

const createGeometry = (scene) => {
    // draw duck
    const mtlloader = new MTLLoader();
    mtlloader.setPath('/static/models/');
    mtlloader.load('12248_Bird_v1.mtl', materials => {
        materials.preload();

        const objloader = new OBJLoader();
        objloader.setMaterials(materials);
        objloader.setPath('/static/models/');
        objloader.load('12248_Bird_v1.obj', object => {
            object.traverse(child => {
                if (child.isMesh) {
                    console.log(child.material);
                    console.log(child.material.name);
                    child.material = materials.materials[child.material.name];
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            object.rotation.x = -Math.PI / 2;
            scene.add(object);
        });
    });

    // draw axes
    const origin = new THREE.Vector3(0, 0, 0);
    const length = 3;
    const hex = 0xff0000;

    const arrowHelperUp = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), origin, length, hex);
    scene.add(arrowHelperUp);

    const arrowHelperRight = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), origin, length, hex);
    scene.add(arrowHelperRight);

    const arrowHelperFront = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), origin, length, hex);
    scene.add(arrowHelperFront);

    // grid helper
    const gridSize = 100;
    const divisions = 100;
    const centerLineColor = 0x888888;
    const gridColor = 0x666666;
    const gridHelper = new THREE.GridHelper(gridSize, divisions, centerLineColor, gridColor);
    scene.add(gridHelper);
}

const createLight = (scene) => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
}

const addControls = (camera, renderer) => {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    return controls;
}

const { scene, camera, renderer } = createScene();
createGeometry(scene);
createLight(scene);
const controls = addControls(camera, renderer);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate(controls, renderer, scene, camera);