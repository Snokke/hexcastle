import * as THREE from 'three';
import { HexTileType } from '../../../Data/Enums/HexTileType';
import HexTileModelConfig from '../../../Data/Configs/HexTileModelConfig';
import ThreeJSHelper from '../../../Helpers/ThreeJSHelper';
import HexGridHelper from '../../../Helpers/HexGridHelper';
import Materials from '../../../Core/Materials/Materials';
import { MaterialType } from '../../../Data/Enums/MaterialType';
import { GameConfig } from '../../../Data/Configs/GameConfig';
import { IHexCoord, IHexTileInstanceData } from '../../../Data/Interfaces/IHexTile';
import { GridOrientation } from '../../../Data/Enums/GridOrientation';
import HexTileInstance from './HexTile/HexTileInstance';
import { HexRotation } from '../../../Data/Enums/HexRotation';
import { ITransform } from '../../../Data/Interfaces/IThreeJS';

export default class Intro extends THREE.Group {
    private tilesInstanceMesh: THREE.InstancedMesh;
    private hexCoordsById: IHexCoord[] = [];
    private wallRadiusOne: THREE.Group;
    private wallRadiusTwo: THREE.Group;

    constructor() {
        super();

        this.init();
    }

    public show(): void {
        this.visible = true;
    }

    public hide(): void {
        this.visible = false;
    }

    private init(): void {
        this.initField();
        this.initCastle();
        this.initWalls();
    }

    public showByRadius(radius: number): void {
        this.hideAllTiles();

        for (let q = -radius; q <= radius; q++) {
            const r1 = Math.max(-radius, -q - radius);
            const r2 = Math.min(radius, -q + radius);
            for (let r = r1; r <= r2; r++) {
                const index: number = this.hexCoordsById.findIndex(coord => coord.q === q && coord.r === r);
                const transform: ITransform = {
                    scale: new THREE.Vector3(1, 1, 1)
                }
                ThreeJSHelper.updateInstanceTransform(this.tilesInstanceMesh, index, transform);
            }
        }

        if (radius === 1) {
            this.wallRadiusOne.visible = true;
        } else {
            this.wallRadiusTwo.visible = true;
        }
    }

    private hideAllTiles(): void {
        for (let i = 0; i < this.hexCoordsById.length; i++) {
            const transform: ITransform = {
                scale: new THREE.Vector3(0.001, 0.001, 0.001)
            }
            ThreeJSHelper.updateInstanceTransform(this.tilesInstanceMesh, i, transform);
        }

        this.wallRadiusOne.visible = false;
        this.wallRadiusTwo.visible = false;
    }

    private initField(): void {
        const hexTileType: HexTileType = HexTileType.Grass;
        const modelName: string = HexTileModelConfig[hexTileType].modelName;
        const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);

        const material: THREE.Material = Materials.getInstance().materials[MaterialType.Transparent];
        const radius: number = GameConfig.gameField.radius.max - 1;

        const count: number = HexGridHelper.getCountByRadius(radius);
        const tilesInstanceMesh = this.tilesInstanceMesh = new THREE.InstancedMesh(geometry, material, count);
        this.add(tilesInstanceMesh);

        const matrix = new THREE.Matrix4();

        const defaultRotation: number = GameConfig.gameField.GridOrientation === GridOrientation.PointyTop ? Math.PI : Math.PI / 2 + Math.PI / 3;
        let instanceId: number = 0;

        for (let q = -radius; q <= radius; q++) {
            const r1 = Math.max(-radius, -q - radius);
            const r2 = Math.min(radius, -q + radius);
            for (let r = r1; r <= r2; r++) {
                const position = HexGridHelper.axialToWorld({ q, r }, GameConfig.gameField.hexSize, GameConfig.gameField.GridOrientation);
                const scale = new THREE.Vector3(0.001, 0.001, 0.001);
                const rotationQuaternion = new THREE.Quaternion();
                rotationQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), defaultRotation);

                matrix.compose(position, rotationQuaternion, scale);

                tilesInstanceMesh.setMatrixAt(instanceId, matrix);
                instanceId++;

                this.hexCoordsById.push({ q, r });
            }
        }

        tilesInstanceMesh.instanceMatrix.needsUpdate = true;
    }

    private initCastle(): void {
        const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel('building_castle_blue');
        const material: THREE.Material = Materials.getInstance().materials[MaterialType.Transparent];
        const castleMesh = new THREE.Mesh(geometry, material);
        this.add(castleMesh);
    }

    private initWalls(): void {
        this.initWallsRadiusOne();
        this.initWallsRadiusTwo();
    }

    private initWallsRadiusOne(): void {
        this.wallRadiusOne = new THREE.Group();
        this.add(this.wallRadiusOne);

        const data: IHexTileInstanceData[] = [
            {
                type: HexTileType.WallCornerAOutside,
                transforms: [
                    { position: { q: 1, r: 0 }, rotation: HexRotation.Rotate240 },
                    { position: { q: 1, r: -1 }, rotation: HexRotation.Rotate300 },
                    { position: { q: 0, r: -1 }, rotation: HexRotation.Rotate0 },
                    { position: { q: -1, r: 0 }, rotation: HexRotation.Rotate60 },
                    { position: { q: -1, r: 1 }, rotation: HexRotation.Rotate120 },
                ],
            },
            {
                type: HexTileType.WallCornerAGate,
                transforms: [
                    { position: { q: 0, r: 1 }, rotation: HexRotation.Rotate180 },
                ],
            }
        ]

        for (let i = 0; i < data.length; i++) {
            const hexTileInstance = new HexTileInstance(data[i], MaterialType.Transparent);
            this.wallRadiusOne.add(hexTileInstance);

            hexTileInstance.showAllTiles();
        }
    }

    private initWallsRadiusTwo(): void {
        this.wallRadiusTwo = new THREE.Group();
        this.add(this.wallRadiusTwo);

        const data: IHexTileInstanceData[] = [
            {
                type: HexTileType.WallCornerAOutside,
                transforms: [
                    { position: { q: 2, r: 0 }, rotation: HexRotation.Rotate240 },
                    { position: { q: 2, r: -2 }, rotation: HexRotation.Rotate300 },
                    { position: { q: 0, r: -2 }, rotation: HexRotation.Rotate0 },
                    { position: { q: -2, r: 0 }, rotation: HexRotation.Rotate60 },
                    { position: { q: -2, r: 2 }, rotation: HexRotation.Rotate120 },
                    { position: { q: 0, r: 2 }, rotation: HexRotation.Rotate180 },
                ],
            },
            {
                type: HexTileType.WallStraight,
                transforms: [
                    { position: { q: 2, r: -1 }, rotation: HexRotation.Rotate300 },
                    { position: { q: 1, r: -2 }, rotation: HexRotation.Rotate0 },
                    { position: { q: -1, r: -1 }, rotation: HexRotation.Rotate60 },
                    { position: { q: -2, r: 1 }, rotation: HexRotation.Rotate120 },
                    { position: { q: 1, r: 1 }, rotation: HexRotation.Rotate240 },
                ],
            },
            {
                type: HexTileType.WallStraightGate,
                transforms: [
                    { position: { q: -1, r: 2 }, rotation: HexRotation.Rotate180 },
                ],
            }
        ]

        for (let i = 0; i < data.length; i++) {
            const hexTileInstance = new HexTileInstance(data[i], MaterialType.Transparent);
            this.wallRadiusTwo.add(hexTileInstance);

            hexTileInstance.showAllTiles();
        }
    }
}
