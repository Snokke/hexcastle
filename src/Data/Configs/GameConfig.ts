import { GridOrientation } from "../Enums/GridOrientation";

const GameConfig = {
    gameField: {
        hexSize: 1.15,
        GridOrientation: GridOrientation.FlatTop,
        radius: {
            min: 1,
            max: 20,
            default: 5
        },
        showTilesTimeScale: 1,
    },
    WFC: {
        syncGenerationRadius: 7,
        stepsPerFrame: {
            minimum: 2,
            values: [
                { radius: 10, steps: 10 },
                { radius: 15, steps: 5 },
                { radius: 20, steps: 3 },
                { radius: 25, steps: 2 }
            ]
        },
    },
    landscape: {
        showTilesDelays: {
            min: 5,
            max: 20,
            coeff: 100,
        },
    },
    walls: {
        showTilesDelays: 50,
        secondWallChance: 0.5,
        secondWallMinRadius: 2,
        maxWallRadius: 6,
        rules: [
            {
                radiusAvailable: 1,
                maxOffset: [0, 0],
            },
            {
                radiusAvailable: 4,
                maxOffset: [1, 1],
            },
            {
                radiusAvailable: Infinity,
                maxOffset: [1, 2],
            }
        ]
    },
    city: {
        showTilesDelays: 60,
        fillPercentage: 0.4,
    },
    nature: {
        showTilesDelays: 25,
        overallFillPercentage: 0.2,
        clusterSettings: {
            trees: {
                fillPercentage: 0.8,
                clusterChance: 0.8,
                maxClusterSize: 10
            },
            rocks: {
                fillPercentage: 0.05,
                clusterChance: 0.7,
                maxClusterSize: 4
            },
            hills: {
                fillPercentage: 0.15,
                clusterChance: 0.35,
                maxClusterSize: 2
            }
        }
    }
}


export { GameConfig };
