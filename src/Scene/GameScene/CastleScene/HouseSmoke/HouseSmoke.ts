import * as THREE from 'three';
import { IHexCoord, ITileShowAnimationConfig } from '../../../../Data/Interfaces/IHexTile';
import { HouseSmokeConfig } from '../../../../Data/Configs/HouseSmokeConfig';
import ThreeJSHelper from '../../../../Helpers/ThreeJSHelper';
import HexGridHelper from '../../../../Helpers/HexGridHelper';
import { GameConfig } from '../../../../Data/Configs/GameConfig';
import { HexRotation } from '../../../../Data/Enums/HexRotation';
import { GridOrientation } from '../../../../Data/Enums/GridOrientation';
import TWEEN from 'three/addons/libs/tween.module.js';
import { TilesShowAnimationConfig } from '../../../../Data/Configs/TilesShowAnimationConfig';
import { HexTileType } from '../../../../Data/Enums/HexTileType';
import Materials from '../../../../Core/Materials/Materials';
import { MaterialType } from '../../../../Data/Enums/MaterialType';

export default class HouseSmoke extends THREE.Group {
    private view: THREE.InstancedMesh;
    private currentIndex: number = 0;
    private shaderMaterial: THREE.ShaderMaterial;
    private showTweens: any[] = [];

    constructor() {
        super();

        this.init();
    }

    public update(dt: number): void {
        if (this.currentIndex === 0) {
            return;
        }

        if (this.shaderMaterial) {
            this.shaderMaterial.uniforms.uTime.value += dt;
        }
    }

    public show(hexPosition: IHexCoord, rotation: HexRotation, parentHexType: HexTileType): void {
        if (this.currentIndex >= HouseSmokeConfig.maxCount) {
            return;
        }

        const defaultRotation: number = GameConfig.gameField.GridOrientation === GridOrientation.PointyTop ? Math.PI : Math.PI / 2 + Math.PI / 3;
        const rotationAngle = HexGridHelper.hexRotationToAngle(rotation) + defaultRotation;
        const rotationQuaternion = new THREE.Quaternion();
        rotationQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationAngle);

        const position: THREE.Vector3 = HexGridHelper.axialToWorld(hexPosition, GameConfig.gameField.hexSize, GameConfig.gameField.GridOrientation);

        const offsetX = HouseSmokeConfig.position.x * Math.cos(-rotationAngle) - HouseSmokeConfig.position.z * Math.sin(-rotationAngle);
        const offsetZ = HouseSmokeConfig.position.x * Math.sin(-rotationAngle) + HouseSmokeConfig.position.z * Math.cos(-rotationAngle);
        const offsetY = HouseSmokeConfig.position.y;
        position.add(new THREE.Vector3(offsetX, offsetY, offsetZ));

        ThreeJSHelper.updateInstanceTransform(this.view, this.currentIndex, {
            position: position,
            rotation: rotationQuaternion,
        });

        this.startShowAnimation(this.currentIndex, parentHexType);

        this.currentIndex++;
    }

    public hideAll(): void {
        for (let i = 0; i < HouseSmokeConfig.maxCount; i++) {
            if (this.showTweens[i]) {
                this.showTweens[i].stop();
            }

            ThreeJSHelper.updateInstanceTransform(this.view, i, {
                scale: new THREE.Vector3(0.001, 0.001, 0.001)
            });
        }

        this.showTweens = [];
        this.currentIndex = 0;
    }

    private startShowAnimation(index: number, type: HexTileType): void {
        const config: ITileShowAnimationConfig = TilesShowAnimationConfig[type];
        const scale = { value: 0.001 };

        this.showTweens[index] = new TWEEN.Tween(scale)
            .to({ value: 1 }, config.time)
            .easing(config.easing)
            .start()
            .onUpdate(() => {
                ThreeJSHelper.updateInstanceTransform(this.view, index, {
                    scale: new THREE.Vector3(scale.value, scale.value, scale.value)
                });
            })
            .onComplete(() => {
                ThreeJSHelper.updateInstanceTransform(this.view, index, {
                    scale: new THREE.Vector3(1, 1, 1)
                });
            });
    }

    private init(): void {
        const smokeGeometry = new THREE.PlaneGeometry(1, 1, 16, 64);
        smokeGeometry.translate(0, 0.5, 0);
        smokeGeometry.scale(HouseSmokeConfig.size.x, HouseSmokeConfig.size.y, HouseSmokeConfig.size.x);

        this.shaderMaterial = Materials.getInstance().materials[MaterialType.Smoke] as THREE.ShaderMaterial;

        const hideScale = 0.001;

        const view = this.view = new THREE.InstancedMesh(smokeGeometry, this.shaderMaterial, HouseSmokeConfig.maxCount);
        this.add(view);

        view.frustumCulled = false;

        const matrix = new THREE.Matrix4();

        for (let i = 0; i < HouseSmokeConfig.maxCount; i++) {
            const position: THREE.Vector3 = new THREE.Vector3();
            const rotationQuaternion = new THREE.Quaternion();
            const scale = new THREE.Vector3(hideScale, hideScale, hideScale);

            matrix.compose(position, rotationQuaternion, scale);
            view.setMatrixAt(i, matrix);
        }

        view.instanceMatrix.needsUpdate = true;
    }
}
