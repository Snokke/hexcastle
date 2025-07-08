import * as THREE from 'three';
import { HexTileType } from "../Enums/HexTileType";

const SmokeConfig = {
    count: 50,
    size: { x: 0.08, y: 2 },
    position: new THREE.Vector3(0.14, 1.2, -0.42),
    tiles: [
        HexTileType.HomeBBlue,
        HexTileType.HomeBRed,
    ],
}

export { SmokeConfig };
