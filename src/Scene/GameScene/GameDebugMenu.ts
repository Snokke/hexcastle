import GUIHelper from "../../Core/DebugMenu/GUIHelper";
import { GlobalEventBus } from "../../Core/GlobalEvents";
import { CloudsConfig } from "../../Data/Configs/CloudsConfig";
import { DebugConfig, DebugGameConfig } from "../../Data/Configs/Debug/DebugConfig";
import { GameConfig } from "../../Data/Configs/GameConfig";
import { GenerateEntityType } from "../../Data/Enums/GenerateEntityType";

export default class GameDebugMenu {

    constructor() {

        this.init();
    }

    private init(): void {
        this.initGeneralFolder();
        this.initSceneFolder();
    }

    private initGeneralFolder(): void {
        const generalFolder = GUIHelper.getGui().addFolder({
            title: 'General',
            expanded: false,
        });

        generalFolder.addInput(DebugConfig, 'fpsMeter', {
            label: 'FPS meter',
        }).on('change', () => {
            GlobalEventBus.emit('debug:fpsMeterChanged');
        });

        generalFolder.addInput(DebugConfig, 'rendererStats', {
            label: 'Renderer stats',
        }).on('change', () => {
            GlobalEventBus.emit('debug:rendererStatsChanged');
        });
    }

    private initSceneFolder(): void {
        const sceneFolder = GUIHelper.getGui().addFolder({
            title: 'Scene',
            expanded: false,
        });

        sceneFolder.addInput(DebugGameConfig, 'grid', {
            label: 'Grid',
        }).on('change', () => {
            GlobalEventBus.emit('debug:gridChanged');
        });

        sceneFolder.addInput(GameConfig.gameField, 'hexSize', {
            label: 'Hex size',
            min: 1.15,
            max: 2,
        });

        // sceneFolder.addInput(GameConfig.gameField.radius, 'max', {
        //     label: 'Field radius max',
        //     min: 20,
        //     max: 50,
        //     step: 1,
        // }).on('change', () => {
        //     GlobalEventBus.emit('debug:maxFieldRadiusChanged');
        // });

        sceneFolder.addSeparator();

        sceneFolder.addInput(GameConfig.gameField, 'showTilesTimeScale', {
            label: 'Show time scale',
            min: 0.1,
            max: 5,
        });

        sceneFolder.addInput(DebugGameConfig, 'showInstantly', {
            label: 'Show instantly',
        });

        this.initLandscapeFolder(sceneFolder);
        this.initWallsFolder(sceneFolder);
        this.initCityFolder(sceneFolder);
        this.initNatureFolder(sceneFolder);
        this.initCloudsFolder(sceneFolder);
    }

    private initLandscapeFolder(folder: any): void {
        const landscapeFolder = folder.addFolder({
            title: 'Landscape',
            expanded: false,
        });

        landscapeFolder.addInput(DebugGameConfig.generateType[GenerateEntityType.Landscape], 'show', {
            label: 'Visible',
        }).on('change', () => {
            GlobalEventBus.emit('debug:landscapeShow');
        });

        landscapeFolder.addInput(DebugGameConfig.generateType[GenerateEntityType.Landscape], 'entropy', {
            label: 'Show entropy',
        }).on('change', () => {
            GlobalEventBus.emit('debug:entropyChanged');
        });

        landscapeFolder.addInput(DebugGameConfig.generateType[GenerateEntityType.Landscape].hexTileDebug, 'rotationAndEdge', {
            label: 'Show tile debug info',
        }).on('change', () => {
            GlobalEventBus.emit('debug:landscapeRotationChanged');
        });
    }

    private initWallsFolder(folder: any): void {
        const wallsFolder = folder.addFolder({
            title: 'Walls',
            expanded: false,
        });

        wallsFolder.addInput(DebugGameConfig.generateType[GenerateEntityType.Walls], 'show', {
            label: 'Visible',
        }).on('change', () => {
            GlobalEventBus.emit('debug:wallsShow');
        });

        wallsFolder.addInput(GameConfig.walls, 'secondWallChance', {
            label: '2nd wall chance',
            min: 0,
            max: 1,
        });
    }

    private initCityFolder(folder: any): void {
        const cityFolder = folder.addFolder({
            title: 'City',
            expanded: false,
        });

        cityFolder.addInput(DebugGameConfig.generateType[GenerateEntityType.City], 'show', {
            label: 'Visible',
        }).on('change', () => {
            GlobalEventBus.emit('debug:cityShow');
        });

        cityFolder.addInput(GameConfig.city, 'fillPercentage', {
            label: 'Fill percentage',
            min: 0,
            max: 1,
        });
    }

    private initNatureFolder(folder: any): void {
        const natureFolder = folder.addFolder({
            title: 'Nature',
            expanded: false,
        });

        natureFolder.addInput(DebugGameConfig.generateType[GenerateEntityType.Nature], 'show', {
            label: 'Visible',
        }).on('change', () => {
            GlobalEventBus.emit('debug:natureShow');
        });

        natureFolder.addInput(GameConfig.nature, 'overallFillPercentage', {
            label: 'Fill percentage',
            min: 0,
            max: 1,
        });
    }

    private initCloudsFolder(folder: any): void {
        const cloudsFolder = folder.addFolder({
            title: 'Clouds',
            expanded: false,
        });

        cloudsFolder.addInput(CloudsConfig, 'show', {
            label: 'Visible',
        }).on('change', () => {
            GlobalEventBus.emit('debug:cloudsShow');
        });

        // this._addCloudButton = cloudsFolder.addButton({
        //     title: 'Add cloud',
        // }).on('click', () => {
        //     // this.events.post('increaseRound');
        // });
    }
}
