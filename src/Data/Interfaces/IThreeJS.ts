import * as THREE from 'three';

export interface ITransform {
    position?: THREE.Vector3;
    rotation?: THREE.Quaternion;
    scale?: THREE.Vector3;
}
