import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/Addons.js';
import Loader from '../Core/Loader/AssetsLoader';
import { ITransform } from '../Data/Interfaces/IThreeJS';

export default class ThreeJSHelper {
    constructor() {

    }

    public static disposeObject(object: THREE.Object3D): void {
        object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                const material = child.material as THREE.Material;
                material.dispose();
            }
        });
    }

    public static killObjects(objects: THREE.Object3D | THREE.Object3D[], parent?: THREE.Object3D): void {
        if (Array.isArray(objects)) {
            objects.forEach((object) => {
                if (parent) {
                    parent.remove(object);
                }

                this.disposeObject(object);
            });
        } else {
            if (parent) {
                parent.remove(objects);
            }

            this.disposeObject(objects);
        }
    }

    public static disposeInstancedMesh(instancedMesh: THREE.InstancedMesh): void {
        instancedMesh.geometry.dispose();
        const material = instancedMesh.material as THREE.Material;
        material.dispose();
    }

    public static killInstancedMesh(instancedMesh: THREE.InstancedMesh | THREE.InstancedMesh[], parent?: THREE.Object3D): void {
        if (Array.isArray(instancedMesh)) {
            instancedMesh.forEach((mesh) => {
                if (parent) {
                    parent.remove(mesh);
                }

                this.disposeInstancedMesh(mesh);
            });
        } else {
            if (parent) {
                parent.remove(instancedMesh);
            }

            this.disposeInstancedMesh(instancedMesh);
        }
    }

    public static setMaterialToChildren(object: THREE.Object3D, material: THREE.Material): void {
        object.traverse((child: THREE.Object3D) => {
            if (child instanceof THREE.Mesh) {
                child.material = material;
            }
        });
    }

    public static getGeometryFromModel(modelName: string): THREE.BufferGeometry {
        const GLTFModel: GLTF = Loader.assets[modelName] as GLTF;
        const model: THREE.Mesh = GLTFModel.scene.children[0] as THREE.Mesh;
        const geometry = model.geometry.clone();
        
        // Apply the mesh transformation to the geometry
        const matrix = new THREE.Matrix4();
        matrix.compose(model.position, model.quaternion, model.scale);
        geometry.applyMatrix4(matrix);
        
        return geometry;
    }

    public static setGeometryRotation(geometry: THREE.BufferGeometry, rotation: THREE.Euler): void {
        const matrix: THREE.Matrix4 = new THREE.Matrix4();
        matrix.makeRotationFromEuler(rotation);
        geometry.applyMatrix4(matrix);
    }

    public static lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }

    public static splitObjectsByProbability(objects: THREE.Object3D[], probabilities: number[]) {
        const shuffledArray: THREE.Object3D[] = objects.sort(() => Math.random() - 0.5);

        const totalItems: number = objects.length;
        let currentIndex: number = 0;
        let remainingItems: number = totalItems;

        return probabilities.map((probability, index) => {
            const isLast = index === probabilities.length - 1;
            const numberOfItems: number = isLast ? remainingItems : Math.round(probability * totalItems);

            const split: THREE.Object3D[] = shuffledArray.slice(currentIndex, currentIndex + numberOfItems);
            currentIndex += numberOfItems;
            remainingItems -= numberOfItems;

            return split;
        });
    }

    public static interpolateColors(color1: THREE.Color, color2: THREE.Color, factor: number): THREE.Color {
        const resultColor = new THREE.Color();
        resultColor.lerpColors(color1, color2, factor);

        return resultColor;
    }

    public static updateInstanceTransform(instanceMesh: THREE.InstancedMesh, index: number, transform: ITransform): void {
        const matrix = new THREE.Matrix4();
        instanceMesh.getMatrixAt(index, matrix);

        const newMatrix = new THREE.Matrix4();
        const newPosition = new THREE.Vector3(0, 0, 0);
        const newRotationQuaternion = new THREE.Quaternion();
        const newScale = new THREE.Vector3(1, 1, 1);

        matrix.decompose(newPosition, newRotationQuaternion, newScale);

        if (transform.position) {
            newPosition.copy(transform.position);
        }

        if (transform.rotation) {
            newRotationQuaternion.copy(transform.rotation);
        }

        if (transform.scale) {
            newScale.copy(transform.scale);
        }

        newMatrix.compose(newPosition, newRotationQuaternion, newScale);

        instanceMesh.setMatrixAt(index, newMatrix);
        instanceMesh.instanceMatrix.needsUpdate = true;
    }

    public static addInstancePosition(instanceMesh: THREE.InstancedMesh, index: number, position: THREE.Vector3): void {
        const matrix = new THREE.Matrix4();
        instanceMesh.getMatrixAt(index, matrix);

        const newMatrix = new THREE.Matrix4();
        const newPosition = new THREE.Vector3(0, 0, 0);
        const newRotationQuaternion = new THREE.Quaternion();
        const newScale = new THREE.Vector3(1, 1, 1);

        matrix.decompose(newPosition, newRotationQuaternion, newScale);

        newPosition.add(position);

        newMatrix.compose(newPosition, newRotationQuaternion, newScale);

        instanceMesh.setMatrixAt(index, newMatrix);
        instanceMesh.instanceMatrix.needsUpdate = true;
    }

    public static getTransformInstance(instanceMesh: THREE.InstancedMesh, index: number): { position: THREE.Vector3, rotation: THREE.Quaternion, scale: THREE.Vector3 } {
        const matrix = new THREE.Matrix4();
        instanceMesh.getMatrixAt(index, matrix);

        const position = new THREE.Vector3();
        const rotation = new THREE.Quaternion();
        const scale = new THREE.Vector3();

        matrix.decompose(position, rotation, scale);

        return { position, rotation, scale };
    }

    public static getRandomBetween(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static getRandomFromArray<T>(array: T[]): T {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }
}
