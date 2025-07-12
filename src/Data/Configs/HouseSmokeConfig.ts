import * as THREE from 'three';
import { HexTileType } from "../Enums/HexTileType";

const HouseSmokeConfig = {
    count: 50,
    size: { x: 0.1, y: 1 },
    position: new THREE.Vector3(0.14, 1.2, -0.42),
    tiles: [
        HexTileType.HomeBBlue,
        HexTileType.HomeBRed,
    ],
}

export { HouseSmokeConfig };
