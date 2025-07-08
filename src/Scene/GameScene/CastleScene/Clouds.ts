import * as THREE from 'three';
import Materials from '../../../Core/Materials/Materials';
import { MaterialType } from '../../../Data/Enums/MaterialType';
import ThreeJSHelper from '../../../Helpers/ThreeJSHelper';
import { GameConfig } from '../../../Data/Configs/GameConfig';
import { CloudsState, CloudState } from '../../../Data/Enums/CloudsState';
import TWEEN from 'three/addons/libs/tween.module.js';
import { CloudType } from '../../../Data/Enums/CloudType';
import { DefaultWFCConfig } from '../../../Data/Configs/WFCConfig';
import { CloudsConfig } from '../../../Data/Configs/CloudsConfig';
import { IClouds } from '../../../Data/Interfaces/ICloud';
import { ITransform } from '../../../Data/Interfaces/IThreeJS';

export default class Clouds extends THREE.Group {
    private cloudInstances: { [key in CloudType]?: THREE.InstancedMesh } = {};
    private movingVector: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    private maxDistance: number;
    private time: number = 0;
    private stepIndex: number = 0;
    private clouds: IClouds[] = [];

    private state: CloudsState = CloudsState.Hided;

    constructor() {
        super();

        this.init();
    }

    public update(dt: number): void {
        if (this.state === CloudsState.Showing) {
            this.showClouds(dt);
        }

        if (this.state === CloudsState.Moving) {
            this.moveClouds(dt);
        }
    }

    public show(): void {
        this.maxDistance = DefaultWFCConfig.radius * GameConfig.gameField.hexSize * 2;
        this.initMovingVector();
        this.initClouds();

        this.state = CloudsState.Showing;
    }

    public showInstantly(): void {
        this.maxDistance = DefaultWFCConfig.radius * GameConfig.gameField.hexSize * 2;
        this.initMovingVector();
        this.initClouds();

        for (let i = 0; i < this.clouds.length; i++) {
            const type = this.clouds[i].type;
            const index = this.clouds[i].index;
            const scale = this.clouds[i].scale;
            const instance = this.cloudInstances[type];

            const transform: ITransform = {
                scale: new THREE.Vector3(scale, scale, scale)
            };
            ThreeJSHelper.updateInstanceTransform(instance, index, transform);
        }

        this.state = CloudsState.Moving;
    }

    public hide(): void {
        this.state = CloudsState.Hided;

        for (let i = 0; i < this.clouds.length; i++) {
            const type = this.clouds[i].type;
            const index = this.clouds[i].index;
            const instance = this.cloudInstances[type];

            const transform: ITransform = {
                scale: new THREE.Vector3(0.001, 0.001, 0.001)
            };
            ThreeJSHelper.updateInstanceTransform(instance, index, transform);

            if (this.clouds[i].tween) {
                this.clouds[i].tween.stop();
            }

            if (this.clouds[i].edgeTween) {
                this.clouds[i].edgeTween.stop();
            }
        }

        this.reset();
    }

    public showInstant(): void {
        this.visible = true;
    }

    public hideInstant(): void {
        this.visible = false;
    }

    private reset(): void {
        this.time = 0;
        this.stepIndex = 0;
        this.clouds = [];
    }

    private initMovingVector(): void {
        const angle = THREE.MathUtils.randFloat(0, 360);
        const angleRadians = angle * (Math.PI / 180);
        this.movingVector.x = Math.cos(angleRadians);
        this.movingVector.z = Math.sin(angleRadians);
    }

    private moveClouds(dt: number): void {
        for (let i = 0; i < this.clouds.length; i++) {
            const type = this.clouds[i].type;
            const index = this.clouds[i].index;

            const vectorDelta = this.movingVector.clone().multiplyScalar(dt * this.clouds[i].speed);
            ThreeJSHelper.addInstancePosition(this.cloudInstances[type], index, vectorDelta);

            const transform = ThreeJSHelper.getTransformInstance(this.cloudInstances[type], index);
            const currentPosition = transform.position;
            const distanceFromCenter = Math.sqrt(currentPosition.x * currentPosition.x + currentPosition.z * currentPosition.z);

            if (distanceFromCenter > this.maxDistance && this.clouds[i].state === CloudState.Moving) {
                this.clouds[i].state = CloudState.Hiding;
                this.hideSingleCloud(type, index, i, this.clouds[i].scale);
            }
        }
    }

    private hideSingleCloud(type: CloudType, index: number, cloudsIndex: number, scale: number): void {
        const instance = this.cloudInstances[type];

        const scaleObject = { value: scale };

        this.clouds[cloudsIndex].edgeTween = new TWEEN.Tween(scaleObject)
            .to({ value: 0.001 }, 400)
            .easing(TWEEN.Easing.Back.In)
            .start()
            .onUpdate(() => {
                const transform: ITransform = {
                    scale: new THREE.Vector3(scaleObject.value, scaleObject.value, scaleObject.value)
                };
                ThreeJSHelper.updateInstanceTransform(instance, index, transform);
            })
            .onComplete(() => {
                const transform: ITransform = {
                    scale: new THREE.Vector3(0.001, 0.001, 0.001)
                }
                ThreeJSHelper.updateInstanceTransform(instance, index, transform);
                this.resetToNewPosition(type, index);

                this.clouds[cloudsIndex].state = CloudState.Showing;
                this.showSingleCloud(type, index, cloudsIndex, scale);
            });
    }

    private showSingleCloud(type: CloudType, index: number, cloudsIndex: number, scale: number): void {
        const instance = this.cloudInstances[type];

        const scaleObject = { value: 0.001 };

        this.clouds[cloudsIndex].edgeTween = new TWEEN.Tween(scaleObject)
            .to({ value: scale }, 400)
            .easing(TWEEN.Easing.Back.Out)
            .start()
            .onUpdate(() => {
                const transform: ITransform = {
                    scale: new THREE.Vector3(scaleObject.value, scaleObject.value, scaleObject.value)
                };
                ThreeJSHelper.updateInstanceTransform(instance, index, transform);
            })
            .onComplete(() => {
                const transform: ITransform = {
                    scale: new THREE.Vector3(scale, scale, scale)
                }
                ThreeJSHelper.updateInstanceTransform(instance, index, transform);
                this.clouds[cloudsIndex].state = CloudState.Moving;
            });
    }

    private resetToNewPosition(type: CloudType, index: number): void {
        const instance = this.cloudInstances[type];
        const transform = ThreeJSHelper.getTransformInstance(instance, index);
        const currentPosition = transform.position;

        const dotProduct = currentPosition.x * this.movingVector.x + currentPosition.z * this.movingVector.z;
        const discriminant = dotProduct * dotProduct - (currentPosition.x * currentPosition.x + currentPosition.z * currentPosition.z - this.maxDistance * this.maxDistance);
        const distanceBack = dotProduct + Math.sqrt(discriminant);

        const displacement = this.movingVector.clone().multiplyScalar(-distanceBack);
        ThreeJSHelper.addInstancePosition(this.cloudInstances[type], index, displacement);
    }

    private showClouds(dt: number): void {
        this.time += dt;

        if (this.time >= CloudsConfig.showStepTime / 1000) {
            this.time = 0;

            const type = this.clouds[this.stepIndex].type;
            const index = this.clouds[this.stepIndex].index;
            const scale = this.clouds[this.stepIndex].scale;
            const instance = this.cloudInstances[type];
            this.showCloud(instance, index, scale, this.stepIndex);

            this.stepIndex++;

            if (this.stepIndex >= this.clouds.length) {
                this.state = CloudsState.Moving;
                this.stepIndex = 0;
            }
        }
    }

    private getCloudsCountByRadius(): number {
        const radius = DefaultWFCConfig.radius;
        const config = CloudsConfig.countByRadius.find(item => radius >= item.radius[0] && radius <= item.radius[1]);
        return config.count;
    }

    private initClouds(): void {
        const cloudsCount = this.getCloudsCountByRadius();

        const indexByType: { [key in CloudType]: number } = {
            [CloudType.Big]: 0,
            [CloudType.Small]: 0
        };

        const positions = this.getUniformCloudPositions(cloudsCount);

        for (let i = 0; i < cloudsCount; i++) {
            const type = Math.random() < 0.5 ? CloudType.Big : CloudType.Small;
            const position = positions[i];
            const rotation = this.getStartRotation();
            const speed = THREE.MathUtils.randFloat(CloudsConfig.speed.min, CloudsConfig.speed.max);
            const scale = THREE.MathUtils.randFloat(CloudsConfig.scale.min, CloudsConfig.scale.max);

            const instance = this.cloudInstances[type];
            const transform: ITransform = {
                position: position.clone(),
                rotation: rotation.clone(),
                scale: new THREE.Vector3(0.001, 0.001, 0.001)
            }
            ThreeJSHelper.updateInstanceTransform(instance, indexByType[type], transform);

            this.clouds.push({
                type: type,
                index: indexByType[type],
                speed: speed,
                scale: scale,
                tween: null,
                edgeTween: null,
                state: CloudState.Moving,
            });

            indexByType[type]++;
        }
    }

    private getUniformCloudPositions(count: number): THREE.Vector3[] {
        const positions: THREE.Vector3[] = [];
        
        const rings = Math.ceil(Math.sqrt(count / Math.PI));
        const sectorsPerRing = Math.ceil(count / rings);
        
        let cloudIndex = 0;
        
        for (let ring = 0; ring < rings && cloudIndex < count; ring++) {
            const ringRadius = (ring + 0.5) * this.maxDistance / rings;
            const sectorsInThisRing = Math.min(sectorsPerRing, count - cloudIndex);
            
            for (let sector = 0; sector < sectorsInThisRing && cloudIndex < count; sector++) {
                const angle = (sector + Math.random() * 0.5) * 2 * Math.PI / sectorsInThisRing;
                const radius = ringRadius + (Math.random() - 0.5) * this.maxDistance / rings;
                
                const x = radius * Math.cos(angle);
                const z = radius * Math.sin(angle);
                const height = THREE.MathUtils.randFloat(CloudsConfig.height.min, CloudsConfig.height.max);
                
                positions.push(new THREE.Vector3(x, height, z));
                cloudIndex++;
            }
        }
        
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }
        
        return positions;
    }

    private getStartRotation(): THREE.Quaternion {
        const rotationYAngle = Math.atan2(this.movingVector.x, this.movingVector.z) + Math.PI / 2;
        const rotationQuaternion = new THREE.Quaternion();
        rotationQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationYAngle);
        return rotationQuaternion;
    }

    private showCloud(instance: THREE.InstancedMesh, index: number, scale: number, stepIndex: number): void {
        const scaleObject = { value: 0.001 };

        this.clouds[stepIndex].tween = new TWEEN.Tween(scaleObject)
            .to({ value: scale }, 300)
            .easing(TWEEN.Easing.Back.Out)
            .start()
            .onUpdate(() => {
                const transform: ITransform = {
                    scale: new THREE.Vector3(scaleObject.value, scaleObject.value, scaleObject.value)
                }
                ThreeJSHelper.updateInstanceTransform(instance, index, transform);
            })
            .onComplete(() => {
                const transform: ITransform = {
                    scale: new THREE.Vector3(scale, scale, scale)
                }
                ThreeJSHelper.updateInstanceTransform(instance, index, transform);
            });
    }

    private init(): void {
        const cloudInstanceBig = this.cloudInstances[CloudType.Big] = this.initCloud('cloud_big');
        this.add(cloudInstanceBig);

        const cloudInstanceSmall = this.cloudInstances[CloudType.Small] = this.initCloud('cloud_small');
        this.add(cloudInstanceSmall);
    }

    private initCloud(modelName: string): THREE.InstancedMesh {
        const hideScale: number = 0.001;
        const material: THREE.Material = Materials.getInstance().materials[MaterialType.Cloud];

        const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);

        const instanceCount: number = CloudsConfig.maxCount;
        const instanceMesh = new THREE.InstancedMesh(geometry, material, instanceCount);

        instanceMesh.frustumCulled = false;

        const matrix = new THREE.Matrix4();

        for (let i = 0; i < instanceCount; i++) {
            const position = new THREE.Vector3(0, 0, 0);
            const rotationYAngle = 0;
            const rotationQuaternion = new THREE.Quaternion();
            rotationQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationYAngle);
            const scale = new THREE.Vector3(hideScale, hideScale, hideScale);

            matrix.compose(position, rotationQuaternion, scale);

            instanceMesh.setMatrixAt(i, matrix);
        }

        instanceMesh.instanceMatrix.needsUpdate = true;
        instanceMesh.castShadow = true;

        return instanceMesh;
    }
}
