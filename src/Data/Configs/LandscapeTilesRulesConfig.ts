import { TileEdgeType } from "../Enums/TileEdgeType";
import { HexTileType } from "../Enums/HexTileType";
import { IHexTilesRule } from "../Interfaces/IBaseSceneData";

const LandscapeTilesRulesConfig: IHexTilesRule[] = [
    // Base tiles
    {
        type: HexTileType.Grass,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
        ],
        weight: 200,
    },
    {
        type: HexTileType.Water,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Water,
            TileEdgeType.Water,
            TileEdgeType.Water,
            TileEdgeType.Water,
            TileEdgeType.Water,
            TileEdgeType.Water,
        ],
        weight: 5,
    },

    // Road tiles
    {
        type: HexTileType.RoadA, // 2 road edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
        ],
        weight: 5,
    },
    {
        type: HexTileType.RoadB, // 2 road edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Road,
            TileEdgeType.Grass,
        ],
        weight: 5,
    },
    {
        type: HexTileType.RoadC, // 2 road edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Road,
        ],
        weight: 5,
    },
    {
        type: HexTileType.RoadD, // 3 road edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Road,
            TileEdgeType.Grass,
        ],
        weight: 3,
    },
    {
        type: HexTileType.RoadE, // 3 road edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Grass,
        ],
        weight: 3,
    },
    {
        type: HexTileType.RoadF, // 3 road edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
        ],
        weight: 3,
    },
    {
        type: HexTileType.RoadG, // 3 road edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Road,
        ],
        weight: 3,
    },
    {
        type: HexTileType.RoadH, // 4 road edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Road,
        ],
        weight: 2,
    },
    {
        type: HexTileType.RoadI, // 4 road edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Grass,
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Road,
            TileEdgeType.Road,
        ],
        weight: 2,
    },
    {
        type: HexTileType.RoadJ, // 4 road edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
        ],
        weight: 2,
    },
    {
        type: HexTileType.RoadK, // 5 road edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Road,
            TileEdgeType.Road,
        ],
        weight: 1,
    },
    {
        type: HexTileType.RoadL, // 6 road edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Road,
        ],
        weight: 1,
    },
    {
        type: HexTileType.RoadM, // 1 road edge
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
        ],
        weight: 1,
    },

    // Coast tiles
    {
        type: HexTileType.CoastA,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Grass,
            TileEdgeType.Coast,
            TileEdgeType.Water,
            TileEdgeType.Coast,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
        ],
        weight: 3,
    },
    {
        type: HexTileType.CoastB,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Coast,
            TileEdgeType.Water,
            TileEdgeType.Water,
            TileEdgeType.Coast,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
        ],
        weight: 3,
    },
    {
        type: HexTileType.CoastC,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Coast,
            TileEdgeType.Water,
            TileEdgeType.Water,
            TileEdgeType.Water,
            TileEdgeType.Coast,
            TileEdgeType.Grass,
        ],
        weight: 3,
    },
    {
        type: HexTileType.CoastD,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Coast,
            TileEdgeType.Water,
            TileEdgeType.Water,
            TileEdgeType.Water,
            TileEdgeType.Water,
            TileEdgeType.Coast,
        ],
        weight: 3,
    },
    {
        type: HexTileType.CoastE,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Grass,
            TileEdgeType.Coast,
            TileEdgeType.Coast,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
        ],
        weight: 3,
    },

    // River tiles
    {
        type: HexTileType.RiverA, // 2 river edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.River,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.River,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
        ],
        weight: 5,
    },
    {
        type: HexTileType.RiverACurvy, // 2 river edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.River,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.River,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
        ],
        weight: 5,
    },
    {
        type: HexTileType.RiverB, // 2 river edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.River,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.River,
            TileEdgeType.Grass,
        ],
        weight: 5,
    },
    {
        type: HexTileType.RiverC, // 3 river edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.River,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.River,
        ],
        weight: 2,
    },
    {
        type: HexTileType.RiverCrossingA, // 2 river edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.River,
            TileEdgeType.Grass,
            TileEdgeType.Road,
            TileEdgeType.River,
            TileEdgeType.Grass,
            TileEdgeType.Road,
        ],
        weight: 2,
    },
    {
        type: HexTileType.RiverCrossingB, // 2 river edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.River,
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.River,
            TileEdgeType.Road,
            TileEdgeType.Grass,
        ],
        weight: 2,
    },
    {
        type: HexTileType.RiverD, // 3 river edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.River,
            TileEdgeType.Grass,
            TileEdgeType.River,
            TileEdgeType.Grass,
            TileEdgeType.River,
            TileEdgeType.Grass,
        ],
        weight: 2,
    },
    {
        type: HexTileType.RiverE, // 3 river edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.River,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.River,
            TileEdgeType.River,
            TileEdgeType.Grass,
        ],
        weight: 2,
    },
    {
        type: HexTileType.RiverF, // 3 river edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.River,
            TileEdgeType.Grass,
            TileEdgeType.River,
            TileEdgeType.River,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
        ],
        weight: 1,
    },
    {
        type: HexTileType.RiverG, // 3 river edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.River,
            TileEdgeType.River,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.River,
        ],
        weight: 2,
    },
    {
        type: HexTileType.RiverH, // 4 river edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.River,
            TileEdgeType.River,
            TileEdgeType.Grass,
            TileEdgeType.River,
            TileEdgeType.Grass,
            TileEdgeType.River,
        ],
        weight: 1,
    },
    {
        type: HexTileType.RiverI, // 4 river edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Grass,
            TileEdgeType.River,
            TileEdgeType.River,
            TileEdgeType.Grass,
            TileEdgeType.River,
            TileEdgeType.River,
        ],
        weight: 1,
    },
    {
        type: HexTileType.RiverJ, // 4 river edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.River,
            TileEdgeType.River,
            TileEdgeType.River,
            TileEdgeType.River,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
        ],
        weight: 1,
    },
    {
        type: HexTileType.RiverK, // 5 river edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.River,
            TileEdgeType.River,
            TileEdgeType.River,
            TileEdgeType.Grass,
            TileEdgeType.River,
            TileEdgeType.River,
        ],
        weight: 1,
    },
    {
        type: HexTileType.RiverL, // 6 river edges
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.River,
            TileEdgeType.River,
            TileEdgeType.River,
            TileEdgeType.River,
            TileEdgeType.River,
            TileEdgeType.River,
        ],
        weight: 1,
    },
    {
        type: HexTileType.Error,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
        ],
        weight: 0,
    },
];

const TopLevelAvailabilityConfig: { [key in HexTileType]?: boolean } = {
    // Base tiles
    [HexTileType.Grass]: true,
    [HexTileType.Water]: false,
    [HexTileType.Error]: true,

    // Road tiles
    [HexTileType.RoadA]: true,
    [HexTileType.RoadB]: true,
    [HexTileType.RoadC]: true,
    [HexTileType.RoadD]: true,
    [HexTileType.RoadE]: true,
    [HexTileType.RoadF]: true,
    [HexTileType.RoadG]: true,
    [HexTileType.RoadH]: true,
    [HexTileType.RoadI]: true,
    [HexTileType.RoadJ]: true,
    [HexTileType.RoadK]: true,
    [HexTileType.RoadL]: true,
    [HexTileType.RoadM]: true,

    // Coast tiles
    [HexTileType.CoastA]: true,
    [HexTileType.CoastB]: false,
    [HexTileType.CoastC]: false,
    [HexTileType.CoastD]: false,
    [HexTileType.CoastE]: true,

    // River tiles
    [HexTileType.RiverA]: false,
    [HexTileType.RiverACurvy]: false,
    [HexTileType.RiverB]: false,
    [HexTileType.RiverC]: false,
    [HexTileType.RiverCrossingA]: false,
    [HexTileType.RiverCrossingB]: false,
    [HexTileType.RiverD]: false,
    [HexTileType.RiverE]: false,
    [HexTileType.RiverF]: false,
    [HexTileType.RiverG]: false,
    [HexTileType.RiverH]: false,
    [HexTileType.RiverI]: false,
    [HexTileType.RiverJ]: false,
    [HexTileType.RiverK]: false,
    [HexTileType.RiverL]: false,
}

export { LandscapeTilesRulesConfig, TopLevelAvailabilityConfig };
