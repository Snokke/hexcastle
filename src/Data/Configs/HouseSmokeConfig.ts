import * as THREE from 'three';
import { HexTileType } from "../Enums/HexTileType";

const HouseSmokeConfig = {
    maxCount: 30,
    size: { x: 0.1, y: 1 },
    position: new THREE.Vector3(0.14, 1.2, -0.42),
    chance: 0.8,
    tiles: [
        HexTileType.HomeBBlue,
        HexTileType.HomeBRed,
    ],
}

export { HouseSmokeConfig };
