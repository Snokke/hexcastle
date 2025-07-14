import { GenerateEntityType } from "../../Enums/GenerateEntityType";

const DebugConfig = {
    fpsMeter: false,
    rendererStats: false,
    orbitControls: true,
    showAxisHelper: false,
    gui: {
        desktop: false,
        mobile: false,
    }
};

const DebugGameConfig = {
    tilesDebugMode: null, // HexTileCategory.Walls,
    grid: false,
    showInstantly: false,
    generateType: {
        [GenerateEntityType.Landscape]: {
            show: true,
            showInstantly: false,
            hexTileDebug: {
                rotationAndEdge: false,
            },
            entropy: false,
            topLevelAvailability: false,
            islands: false,
        },
        [GenerateEntityType.Walls]: {
            show: true,
            showInstantly: false,
            hexTileDebug: {
                rotationAndEdge: false,
            },
            innerOuterTiles: false,
        },
        [GenerateEntityType.City]: {
            show: true,
            showInstantly: false,
            hexTileDebug: {
                rotationAndEdge: false,
            },
        },
        [GenerateEntityType.Nature]: {
            show: true,
            showInstantly: false,
            hexTileDebug: {
                rotationAndEdge: false,
            },
        }
    },
}


export { DebugConfig, DebugGameConfig };
