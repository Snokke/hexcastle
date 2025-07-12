import * as THREE from 'three';
import { HexTileType } from '../../../../../Data/Enums/HexTileType';
import HexTilePartAbstract from './HexTilePartAbstract';
import { HexTilePartsConfig } from '../../../../../Data/Configs/HexTilePartsConfig';
import { IHexCoord, ITileShowAnimationConfig } from '../../../../../Data/Interfaces/IHexTile';
import HexGridHelper from '../../../../../Helpers/HexGridHelper';
import { GameConfig } from '../../../../../Data/Configs/GameConfig';
import { HexRotation } from '../../../../../Data/Enums/HexRotation';
import { GridOrientation } from '../../../../../Data/Enums/GridOrientation';
import TWEEN from 'three/addons/libs/tween.module.js';
import { TilesShowAnimationConfig } from '../../../../../Data/Configs/TilesShowAnimationConfig';

export default class HexTileParts extends THREE.Group {
    private parts: HexTilePartAbstract[] = [];

    constructor() {
        super();
    }

    public update(dt: number): void {
        this.parts.forEach(part => {
            part.update(dt);
        });
    }

    public showPart(hexTileType: HexTileType, rotation: HexRotation, position: IHexCoord): void {
        const partConfig = HexTilePartsConfig[hexTileType];
        if (partConfig) {
            const className = partConfig.className;
            const partInstance = new className(partConfig.type);
            this.parts.push(partInstance);
            this.add(partInstance);

            const partPosition: THREE.Vector3 = HexGridHelper.axialToWorld(position, GameConfig.gameField.hexSize, GameConfig.gameField.GridOrientation);
            partInstance.position.set(partPosition.x, 0, partPosition.z);

            const defaultRotation: number = GameConfig.gameField.GridOrientation === GridOrientation.PointyTop ? Math.PI : Math.PI / 2 + Math.PI / 3;
            HexGridHelper.setRotation(partInstance, rotation);
            partInstance.rotation.y += defaultRotation;

            partInstance.hide();

            this.startShowAnimation(partInstance, hexTileType);
        }
    }

    public showPartInstantly(hexTileType: HexTileType, rotation: HexRotation, position: IHexCoord): void {
        const partConfig = HexTilePartsConfig[hexTileType];
        if (partConfig) {
            const className = partConfig.className;
            const partInstance = new className(partConfig.type);
            this.parts.push(partInstance);
            this.add(partInstance);

            const partPosition: THREE.Vector3 = HexGridHelper.axialToWorld(position, GameConfig.gameField.hexSize, GameConfig.gameField.GridOrientation);
            partInstance.position.set(partPosition.x, 0, partPosition.z);

            const defaultRotation: number = GameConfig.gameField.GridOrientation === GridOrientation.PointyTop ? Math.PI : Math.PI / 2 + Math.PI / 3;
            HexGridHelper.setRotation(partInstance, rotation);
            partInstance.rotation.y += defaultRotation;

            partInstance.show();
            partInstance.scale.set(1, 1, 1);
        }
    }

    private startShowAnimation(part: HexTilePartAbstract, type: HexTileType): void {
        const config: ITileShowAnimationConfig = TilesShowAnimationConfig[type];
        const scale = { value: 0.001 };

        new TWEEN.Tween(scale)
            .to({ value: 1 }, config.time)
            .easing(config.easing)
            .start()
            .onStart(() => {
                part.show();
            })
            .onUpdate(() => {
                part.scale.set(scale.value, scale.value, scale.value);
            })
            .onComplete(() => {
                part.scale.set(1, 1, 1);
            });
    }

    public reset(): void {
        this.parts.forEach(part => {
            part.reset();
            this.remove(part);
        });

        this.parts = [];
    }

}
