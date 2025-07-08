import * as THREE from 'three';
import { IHexTilesResult, INewTileStep } from '../../../Data/Interfaces/IWFC';
import { DefaultWFCConfig } from '../../../Data/Configs/WFCConfig';
import { HexWFC } from './Landscape/HexWFC';
import HexTileInstance from './HexTile/HexTileInstance';
import { IHexCoord, IHexTileInstanceData, IHexTileTransform } from '../../../Data/Interfaces/IHexTile';
import { TilesShowState } from '../../../Data/Enums/TilesShowState';
import EntropyHelper from './DebugViewHelpers/EntropyHelper';
import { GlobalEventBus } from '../../../Core/GlobalEvents';
import DebugGrid from './DebugViewHelpers/DebugGrid';
import { GameConfig } from '../../../Data/Configs/GameConfig';
import Intro from './Intro';
import FieldRadiusHelper from './FieldRadiusHelper';
import HexGridHelper from '../../../Helpers/HexGridHelper';
import { IWallCityConfig, IWallConfig } from '../../../Data/Interfaces/IWall';
import { GenerateEntityType } from '../../../Data/Enums/GenerateEntityType';
import { DebugGameConfig } from '../../../Data/Configs/Debug/DebugConfig';
import { GenerateEntityOrder } from '../../../Data/Configs/GenerateEntityConfig';
import { WallGenerator } from './Walls/WallGenerator';
import WallDebug from './Walls/WallDebug';
import TopLevelAvailabilityDebug from './DebugViewHelpers/TopLevelAvailabilityDebug';
import { TopLevelAvailabilityConfig } from '../../../Data/Configs/LandscapeTilesRulesConfig';
import IslandFinder from './Walls/IslandFinder';
import IslandsDebug from './DebugViewHelpers/IslandsDebug';
import { IIsland } from '../../../Data/Interfaces/IIsland';
import { ILibrariesData } from '../../../Data/Interfaces/IBaseSceneData';
import { CityGenerator } from './City/CityGenerator';
import ThreeJSHelper from '../../../Helpers/ThreeJSHelper';
import HexTileParts from './HexTile/HexTileParts/HexTileParts';
import { HexTilePartsConfig } from '../../../Data/Configs/HexTilePartsConfig';
import Clouds from './Clouds';
import { NatureGenerator } from './Nature/NatureGenerator';
import { ButtonType } from '../../../Data/Enums/ButtonType';
import { CloudsConfig } from '../../../Data/Configs/CloudsConfig';
import Smoke from './Smoke/Smoke';
import { SmokeConfig } from '../../../Data/Configs/SmokeConfig';

export default class CastleScene extends THREE.Group {

    private hexTileInstances: { [key in GenerateEntityType]?: HexTileInstance[] } = {};
    private steps: { [key in GenerateEntityType]?: INewTileStep[] } = {};
    private time: number = 0;
    private stepIndex: number = 0;
    private tilesShowState: TilesShowState = TilesShowState.NotReady;
    private entropyHelper: EntropyHelper;
    private hexWFC: HexWFC;
    private wallGenerator: WallGenerator;
    private intro: Intro;
    private fieldRadiusHelper: FieldRadiusHelper;
    private showingEntityType: GenerateEntityType;
    private showingEntityIndex: number = 0;
    private previousGeneratePercent: number = 0;
    private showTileStepTime: number = 0;
    private needAsyncGenerate: boolean = false;
    private generatingStopped: boolean = false;
    private newRadius: number = GameConfig.gameField.radius.default;
    private debugGrid: DebugGrid;
    private wallDebug: WallDebug;
    private topLevelAvailability: IHexCoord[] = [];
    private topLevelAvailabilityAfterCity: IHexCoord[] = [];
    private topLevelAvailabilityDebug: TopLevelAvailabilityDebug;
    private islandFinder: IslandFinder;
    private islandsDebug: IslandsDebug;
    private islands: IIsland[] = [];
    private data: ILibrariesData;
    private cityGenerator: CityGenerator;
    private wallsCityConfig: IWallCityConfig[] = [];
    private hexTileParts: HexTileParts;
    private clouds: Clouds;
    private natureGenerator: NatureGenerator;
    private stopButtonActive: boolean = false;
    private smoke: Smoke;

    private isIntroActive: boolean = true;

    constructor(data: ILibrariesData) {
        super();

        this.data = data;

        this.init();
    }

    public update(dt: number): void {
        if (this.tilesShowState === TilesShowState.Ready || this.tilesShowState === TilesShowState.Showing) {
            this.tilesShowState = TilesShowState.Showing;
            this.time += dt;

            if (this.time >= this.showTileStepTime / 1000) {
                const stepsToShow = Math.floor(this.time * 1000 / this.showTileStepTime);
                this.time -= (this.showTileStepTime / 1000) * stepsToShow;

                this.showTiles(this.stepIndex, stepsToShow, this.showingEntityType);
                this.stepIndex += stepsToShow;
            }
        }

        if (this.tilesShowState === TilesShowState.CompleteEntity) {
            this.afterShowGenerateEntity();
        }

        this.hexTileParts.update(dt);
        this.clouds.update(dt);
        this.smoke.update();
    }

    public start(): void {
        this.intro.showByRadius(DefaultWFCConfig.radius);
    }

    private init(): void {
        this.initHexWFC();
        this.initWallGenerator();
        this.initIntro();
        this.initDebugGrid();
        this.initFieldRadiusHelper();
        this.initStartData();
        this.initEntropyHelper();
        this.initWallDebug();
        this.initTopLevelAvailabilityDebug();
        this.initIslandFinder();
        this.initIslandsDebug();
        this.initCityGenerator();
        this.initHexTileParts();
        this.initClouds();
        this.initNatureGenerator();
        this.initSmoke();

        this.initGlobalListeners();
    }

    private initHexWFC(): void {
        this.hexWFC = new HexWFC();
    }

    private initWallGenerator(): void {
        this.wallGenerator = new WallGenerator();
    }

    private initIntro(): void {
        const intro = this.intro = new Intro();
        this.add(intro);
    }

    private initDebugGrid(): void {
        if (DebugGameConfig.grid) {
            const debugGrid = this.debugGrid = new DebugGrid();
            this.add(debugGrid);

            debugGrid.create(DefaultWFCConfig.radius);
        }
    }

    private initFieldRadiusHelper(): void {
        const fieldRadiusHelper = this.fieldRadiusHelper = new FieldRadiusHelper();
        this.add(fieldRadiusHelper);
    }

    private initStartData(): void {
        for (const generateType in GenerateEntityType) {
            const type = GenerateEntityType[generateType as keyof typeof GenerateEntityType];
            this.hexTileInstances[type] = [];
            this.steps[type] = [];
        }
    }

    private async generateLandscapeTiles(): Promise<void> {
        this.hexWFC.setConfig(DefaultWFCConfig);

        if (this.needAsyncGenerate) {
            await this.generateLandscapeTilesAsync();
        } else {
            this.generateLandscapeTilesSync();
        }

        this.entropyHelper?.setData(this.steps[GenerateEntityType.Landscape], DefaultWFCConfig.radius);
    }

    private generateLandscapeTilesSync(): void {
        this.hexWFC.generate();

        this.steps[GenerateEntityType.Landscape] = this.hexWFC.getSteps();;

        const tiles: IHexTilesResult[] = this.hexWFC.getTiles();
        this.createTiles(tiles, GenerateEntityType.Landscape);

        this.updateTopLevelAvailability(tiles);

        const islands: IIsland[] = this.islands = this.islandFinder.findIslandsWithMinSize(this.topLevelAvailability, 1);
        this.islandsDebug?.show(islands);
    }

    private async generateLandscapeTilesAsync(): Promise<void> {
        GlobalEventBus.emit('game:startGeneratingWorld');
        this.stopButtonActive = true;

        const stepsPerFrame = this.getStepsPerFrame(DefaultWFCConfig.radius);

        const result = await this.hexWFC.generateAsync(
            (stepIndex) => this.updateLoadingProgress(stepIndex),
            stepsPerFrame,
        );

        if (result.success) {
            this.steps[GenerateEntityType.Landscape] = this.hexWFC.getSteps();
            this.createTiles(result.grid, GenerateEntityType.Landscape);

            this.updateTopLevelAvailability(result.grid);

            const islands: IIsland[] = this.islands = this.islandFinder.findIslandsWithMinSize(this.topLevelAvailability, 1);
            this.islandsDebug?.show(islands);
        }

        GlobalEventBus.emit('game:finishGeneratingWorld');
        this.stopButtonActive = false;
        this.previousGeneratePercent = 0;
    }

    private generateWall(): void {
        if (this.islands.length === 0) {
            return;
        }

        const wallTiles: IHexTilesResult[] = [];
        let wallsCount: number = Math.random() < GameConfig.walls.secondWallChance && this.islands.length > 1 ? 2 : 1;
        const insideTiles: IHexCoord[] = [];
        const notAvailableTiles: IHexCoord[] = [];

        for (let i = 0; i < wallsCount; i++) {
            const island: IIsland = this.islands[i];

            if (island.radiusAvailable < GameConfig.walls.secondWallMinRadius && wallsCount === 2 && i === 1) {
                continue;
            }

            let radius = 1;
            let maxOffset = 0;

            GameConfig.walls.rules.forEach((rule) => {
                if (island.radiusAvailable >= rule.radiusAvailable) {
                    maxOffset = ThreeJSHelper.getRandomBetween(rule.maxOffset[rule.maxOffset[0]], rule.maxOffset[rule.maxOffset[1]]);
                    radius = Math.min(island.radiusAvailable - maxOffset - (maxOffset === 0 ? 0 : 1), GameConfig.walls.maxWallRadius);

                    if (radius > 1) {
                        radius = ThreeJSHelper.getRandomBetween(radius - 1, radius);
                    }
                }
            });

            const wallConfig: IWallConfig = {
                center: island.center,
                radius: radius,
                maxOffset: maxOffset,
            };

            this.wallGenerator.generate(wallConfig);
            const steps: INewTileStep[] = this.wallGenerator.getSteps();
            this.steps[GenerateEntityType.Walls].push(...steps);

            wallTiles.push(...this.wallGenerator.getTiles());

            this.wallsCityConfig.push({
                center: island.center,
                tiles: this.wallGenerator.getInsideTiles(),
            });

            const wallInsideTiles: IHexCoord[] = this.wallGenerator.getInsideTiles();
            insideTiles.push(...wallInsideTiles);

            for (let i = 0; i < steps.length; i++) {
                const step: INewTileStep = steps[i];
                if (step.tile) {
                    notAvailableTiles.push(step.tile.position);
                }
            }

            notAvailableTiles.push(...wallInsideTiles);
        }

        this.createTiles(wallTiles, GenerateEntityType.Walls);
        this.wallDebug?.show(insideTiles);

        this.topLevelAvailabilityAfterCity = HexGridHelper.removeSameTiles(this.topLevelAvailability, notAvailableTiles);
    }

    private generateCity(): void {
        const cityTiles: IHexTilesResult[] = [];

        if (this.islands.length === 0) {
            this.cityGenerator.generateOnlyCastle(this.topLevelAvailability, 0);

            const steps: INewTileStep[] = this.cityGenerator.getSteps();
            this.steps[GenerateEntityType.City].push(...steps);

            const tiles: IHexTilesResult[] = this.cityGenerator.getTiles();
            cityTiles.push(...tiles);

            if (tiles.length > 0) {
                const castleTile: IHexCoord = tiles[0].position;
                this.topLevelAvailabilityAfterCity = HexGridHelper.removeSameTiles(this.topLevelAvailability, [castleTile]);
            }
        } else {
            for (let i = 0; i < this.wallsCityConfig.length; i++) {
                const wallCityConfig: IWallCityConfig = this.wallsCityConfig[i];

                this.cityGenerator.generate(wallCityConfig, i);
                const steps: INewTileStep[] = this.cityGenerator.getSteps();
                this.steps[GenerateEntityType.City].push(...steps);

                cityTiles.push(...this.cityGenerator.getTiles());
            }
        }

        if (cityTiles.length != 0) {
            this.createTiles(cityTiles, GenerateEntityType.City);
        }
    }

    private generateNature(): void {
        if (this.topLevelAvailabilityAfterCity.length === 0) {
            return;
        }

        this.natureGenerator.generate(this.topLevelAvailabilityAfterCity);

        const steps: INewTileStep[] = this.natureGenerator.getSteps();
        this.steps[GenerateEntityType.Nature] = steps;

        const tiles: IHexTilesResult[] = this.natureGenerator.getTiles();
        this.createTiles(tiles, GenerateEntityType.Nature);
    }

    private getStepsPerFrame(radius: number): number {
        for (let i = 0; i < GameConfig.WFC.stepsPerFrame.values.length; i++) {
            const item = GameConfig.WFC.stepsPerFrame.values[i];
            if (radius <= item.radius) {
                return item.steps;
            }
        }

        return GameConfig.WFC.stepsPerFrame.minimum;
    }

    private updateLoadingProgress(stepIndex: number): void {
        const totalCells = HexGridHelper.getCountByRadius(DefaultWFCConfig.radius);
        const percentage = Math.round(stepIndex / totalCells * 100) / 100;

        if (this.previousGeneratePercent !== percentage) {
            GlobalEventBus.emit('game:progressGeneratingWorld', percentage);
        }

        this.previousGeneratePercent = percentage;
    }

    private createTiles(tiles: IHexTilesResult[], generateEntityType: GenerateEntityType): void {
        const hexTileInstancesData: IHexTileInstanceData[] = this.convertToHexTileInstanceData(tiles);

        this.hexTileInstances[generateEntityType] = [];

        for (let i = 0; i < hexTileInstancesData.length; i++) {
            const hexTileInstance = new HexTileInstance(hexTileInstancesData[i]);
            this.add(hexTileInstance);

            const debugConfig = DebugGameConfig.generateType[generateEntityType].hexTileDebug;
            if (debugConfig.rotationAndEdge) {
                hexTileInstance.enableDebug(debugConfig);
            }

            this.hexTileInstances[generateEntityType].push(hexTileInstance);
        }

        this.hexTileInstances[generateEntityType].forEach((hexTileInstance) => {
            hexTileInstance.visible = DebugGameConfig.generateType[generateEntityType].show;
        });
    }

    private initEntropyHelper(): void {
        if (DebugGameConfig.generateType[GenerateEntityType.Landscape].entropy) {
            const entropyHelper = this.entropyHelper = new EntropyHelper();
            this.add(entropyHelper);
        }
    }

    private initWallDebug(): void {
        if (DebugGameConfig.generateType[GenerateEntityType.Walls].innerOuterTiles) {
            const wallDebug = this.wallDebug = new WallDebug();
            this.add(wallDebug);
        }
    }

    private updateTopLevelAvailability(tiles: IHexTilesResult[]): void {
        const { available, unavailable } = this.getTopLevelAvailableTiles(tiles);
        this.topLevelAvailability = available;
        this.topLevelAvailabilityDebug?.show(available, unavailable);
    }

    private initTopLevelAvailabilityDebug(): void {
        if (DebugGameConfig.generateType[GenerateEntityType.Landscape].topLevelAvailability) {
            const topLevelAvailabilityDebug = this.topLevelAvailabilityDebug = new TopLevelAvailabilityDebug();
            this.add(topLevelAvailabilityDebug);
        }
    }

    private initIslandFinder(): void {
        this.islandFinder = new IslandFinder();
    }

    private initIslandsDebug(): void {
        if (DebugGameConfig.generateType[GenerateEntityType.Landscape].islands) {
            this.islandsDebug = new IslandsDebug();
            this.add(this.islandsDebug);
        }
    }

    private initCityGenerator(): void {
        this.cityGenerator = new CityGenerator();
    }

    private initHexTileParts(): void {
        this.hexTileParts = new HexTileParts();
        this.add(this.hexTileParts);
    }

    private initClouds(): void {
        this.clouds = new Clouds();
        this.add(this.clouds);
    }

    private initNatureGenerator(): void {
        this.natureGenerator = new NatureGenerator();
    }

    private initSmoke(): void {
        const smoke = this.smoke = new Smoke();
        this.add(smoke);
    }

    private showPredefinedLandscapeTiles(): void {
        if (DebugGameConfig.generateType[this.showingEntityType].show === false) {
            return;
        }

        const predefinedTiles = DefaultWFCConfig.predefinedTiles;
        for (let i = 0; i < predefinedTiles.length; i++) {
            const hexTileInstance = this.findHexTileInstanceByPosition(predefinedTiles[i].coord, GenerateEntityType.Landscape);
            if (hexTileInstance) {
                hexTileInstance.showTile(predefinedTiles[i].coord);
            }
        }
    }

    private showTiles(stepIndex: number, count: number, generateEntityType: GenerateEntityType): void {
        let needShadowUpdate: boolean = false;
        for (let i = stepIndex; i < stepIndex + count; i++) {
            if (i >= this.steps[generateEntityType].length) {
                this.tilesShowState = TilesShowState.CompleteEntity;
                return;
            }

            const step: INewTileStep = this.steps[generateEntityType][i];
            if (step.tile) {
                const hexTileInstance = this.findHexTileInstanceByPosition(step.tile.position, generateEntityType);
                if (hexTileInstance) {
                    hexTileInstance.showTile(step.tile.position);

                    if (HexTilePartsConfig[step.tile.type]) {
                        this.hexTileParts.showPart(step.tile.type, step.tile.rotation, step.tile.position);
                    }

                    if (SmokeConfig.tiles.includes(step.tile.type)) {
                        this.smoke.show(step.tile.position, step.tile.rotation, step.tile.type);
                    }
                }
            }
        }

        if (needShadowUpdate) {
            this.data.renderer.shadowMap.needsUpdate = true;
        }

        if (this.showingEntityType === GenerateEntityType.Landscape) {
            this.entropyHelper?.drawStep(stepIndex);
        }
    }

    private getTopLevelAvailableTiles(tiles: IHexTilesResult[]): { available: IHexCoord[], unavailable: IHexCoord[] } {
        const topLevelAvailableTiles: IHexCoord[] = [];
        const topLevelUnavailableTiles: IHexCoord[] = [];

        for (let i = 0; i < tiles.length; i++) {
            const tile: IHexTilesResult = tiles[i];
            if (TopLevelAvailabilityConfig[tile.type]) {
                topLevelAvailableTiles.push(tile.position);
            } else {
                topLevelUnavailableTiles.push(tile.position);
            }
        }

        return {
            available: topLevelAvailableTiles,
            unavailable: topLevelUnavailableTiles,
        };
    }

    private afterShowGenerateEntity(): void {
        switch (this.showingEntityType) {
            case GenerateEntityType.Landscape:
                this.entropyHelper?.reset();
                break;
        }

        this.showingEntityIndex++;
        if (this.showingEntityIndex >= GenerateEntityOrder.length) {
            this.tilesShowState = TilesShowState.Completed;
            this.clouds.show();
            return;
        }

        this.showingEntityType = GenerateEntityOrder[this.showingEntityIndex];
        this.stepIndex = 0;
        this.time = 0;
        this.configureDelay();

        this.tilesShowState = TilesShowState.Ready;

        this.checkShowEntityInstant();
        // this.checkToShowEntity();
    }

    private showAllTilesByType(generateEntityType: GenerateEntityType): void {
        for (let i = 0; i < this.hexTileInstances[generateEntityType].length; i++) {
            this.hexTileInstances[generateEntityType][i].showAllTiles();
        }
    }

    private convertToHexTileInstanceData(grid: IHexTilesResult[]): IHexTileInstanceData[] {
        const hexTileInstancesData: IHexTileInstanceData[] = [];
        grid.forEach((hexTileResult) => {
            const hexTileTransform: IHexTileTransform = {
                position: hexTileResult.position,
                rotation: hexTileResult.rotation,
            };

            const existingType = hexTileInstancesData.find((item) => item.type === hexTileResult.type);
            if (existingType) {
                existingType.transforms.push(hexTileTransform);
            } else {
                hexTileInstancesData.push({
                    type: hexTileResult.type,
                    transforms: [hexTileTransform],
                });
            }
        });

        return hexTileInstancesData;
    }

    private findHexTileInstanceByPosition(position: IHexCoord, generateEntityType: GenerateEntityType): HexTileInstance {
        return this.hexTileInstances[generateEntityType].find(hexTileInstance => hexTileInstance.hasTileByPosition(position));
    }

    private resetScene(): void {
        this.tilesShowState = TilesShowState.NotReady;

        this.time = 0;
        this.stepIndex = 0;
        this.showingEntityIndex = 0;
        this.showingEntityType = GenerateEntityOrder[this.showingEntityIndex];
        this.previousGeneratePercent = 0;
        this.islands = [];
        this.wallsCityConfig = [];
        this.topLevelAvailabilityAfterCity = [];

        for (const generateType in GenerateEntityType) {
            const type: GenerateEntityType = GenerateEntityType[generateType as keyof typeof GenerateEntityType];
            this.hexTileInstances[type].forEach((hexTileInstance) => {
                hexTileInstance.reset();
                this.remove(hexTileInstance);
            });
            this.hexTileInstances[type] = [];
            this.steps[type] = [];
        }

        this.hexTileParts.reset();
        this.wallDebug?.reset();
        this.entropyHelper?.reset();
        this.topLevelAvailabilityDebug?.reset();
        this.islandsDebug?.reset();

        this.clouds.hide();
        this.smoke.hideAll();
    }

    private initGlobalListeners(): void {
        GlobalEventBus.on('game:generate', () => this.generateScene());
        GlobalEventBus.on('game:fieldRadiusChanged', (radius: number) => this.onFieldRadiusChanged(radius));
        GlobalEventBus.on('game:stopGenerate', () => this.stopGenerate());
        GlobalEventBus.on('ui:sliderPointerUp', () => this.onSliderPointerUp());
        GlobalEventBus.on('ui:sliderPointerDown', () => this.sliderPointerDown());
        GlobalEventBus.on('game:pressKey', (buttonType: ButtonType) => this.onPressKey(buttonType));

        GlobalEventBus.on('debug:gridChanged', () => this.debugOnGridChanged());
        GlobalEventBus.on('debug:landscapeShow', () => this.debugOnLayerShow(GenerateEntityType.Landscape));
        GlobalEventBus.on('debug:entropyChanged', () => this.debugOnEntropyChanged());
        GlobalEventBus.on('debug:landscapeRotationChanged', () => this.debugOnLandscapeRotationChanged());
        GlobalEventBus.on('debug:wallsShow', () => this.debugOnLayerShow(GenerateEntityType.Walls));
        GlobalEventBus.on('debug:cityShow', () => this.debugOnLayerShow(GenerateEntityType.City));
        GlobalEventBus.on('debug:natureShow', () => this.debugOnLayerShow(GenerateEntityType.Nature));
        GlobalEventBus.on('debug:cloudsShow', () => this.debugOnCloudsShow());
    }

    private async generateScene(): Promise<void> {
        DefaultWFCConfig.radius = this.newRadius;
        GlobalEventBus.emit('game:generateStarted');

        this.generatingStopped = false;
        this.disableIntro();

        this.resetScene();
        this.checkAsyncGenerate();

        await this.generateLandscapeTiles();
        if (this.generatingStopped) {
            return;
        }

        this.generateWall();
        this.generateCity();
        this.generateNature();

        this.configureDelay();
        this.showPredefinedLandscapeTiles();

        this.data.renderer.shadowMap.needsUpdate = true;
        this.tilesShowState = TilesShowState.Ready;

        this.checkShowEntityInstant();
        // this.checkToShowEntity();

        if (DebugGameConfig.showInstantly) {
            for (const generateType in GenerateEntityType) {
                const type: GenerateEntityType = GenerateEntityType[generateType as keyof typeof GenerateEntityType];
                this.showAllTilesByType(type);
            }

            this.tilesShowState = TilesShowState.Completed;
            this.clouds.showInstantly();

            for (const entityType in this.steps) {
                for (let i = 0; i < this.steps[entityType].length; i++) {
                    const step: INewTileStep = this.steps[entityType][i];
                    if (step?.tile?.type && HexTilePartsConfig[step.tile.type]) {
                        this.hexTileParts.showPartInstantly(step.tile.type, step.tile.rotation, step.tile.position);
                    }
                }
            }
        }
    }

    private checkAsyncGenerate(): void {
        this.needAsyncGenerate = DefaultWFCConfig.radius > GameConfig.WFC.syncGenerationRadius;
    }

    private disableIntro(): void {
        if (this.isIntroActive) {
            this.intro.hide();
            this.isIntroActive = false;
        }
    }

    private checkShowEntityInstant(): void {
        const generateTypeConfig = DebugGameConfig.generateType[this.showingEntityType];
        if (generateTypeConfig.showInstantly && generateTypeConfig.show) {
            this.showAllTilesByType(this.showingEntityType);
            this.tilesShowState = TilesShowState.CompleteEntity;
            this.afterShowGenerateEntity();
        }
    }

    // private checkToShowEntity(): void {
    //     if (DebugGameConfig.generateType[this.showingEntityType].show === false) {
    //         this.tilesShowState = TilesShowState.CompleteEntity;
    //         this.afterShowGenerateEntity();
    //     }
    // }

    private configureDelay(): void {
        switch (this.showingEntityType) {
            case GenerateEntityType.Landscape:
                const delays = GameConfig.landscape.showTilesDelays;
                this.showTileStepTime = Math.max(delays.min, Math.min(delays.max, 1 / DefaultWFCConfig.radius * delays.coeff)) / GameConfig.gameField.showTilesTimeScale;
                break;

            case GenerateEntityType.Walls:
                this.showTileStepTime = GameConfig.walls.showTilesDelays / GameConfig.gameField.showTilesTimeScale;
                break;

            case GenerateEntityType.City:
                this.showTileStepTime = GameConfig.city.showTilesDelays / GameConfig.gameField.showTilesTimeScale;
                break;

            case GenerateEntityType.Nature:
                this.showTileStepTime = GameConfig.nature.showTilesDelays / GameConfig.gameField.showTilesTimeScale;
                break;
        }
    }

    private onFieldRadiusChanged(radius: number): void {
        this.newRadius = radius;

        if (this.isIntroActive) {
            this.intro.showByRadius(this.newRadius);
        } else {
            this.fieldRadiusHelper.show(this.newRadius);
        }

        this.debugGrid?.create(this.newRadius);
    }

    private onSliderPointerUp(): void {
        if (!this.isIntroActive) {
            this.fieldRadiusHelper.hide();
        }
    }

    private sliderPointerDown(): void {
        if (!this.isIntroActive) {
            this.fieldRadiusHelper.show(this.newRadius);
        }
    }

    private onPressKey(buttonType: ButtonType): void {
        switch (buttonType) {
            case ButtonType.Left:
                GlobalEventBus.emit('ui:sliderDecreaseRadius');
                break;

            case ButtonType.Right:
                GlobalEventBus.emit('ui:sliderIncreaseRadius');
                break;

            case ButtonType.Start:
                if (this.stopButtonActive) {
                    this.stopGenerate();
                } else {
                    this.generateScene();
                }
                break;
        }
    }

    private stopGenerate(): void {
        this.hexWFC.stopGeneration();

        this.intro.show();
        this.intro.showByRadius(DefaultWFCConfig.radius);
        this.isIntroActive = true;

        this.resetScene();
        this.tilesShowState = TilesShowState.NotReady;

        this.generatingStopped = true;
    }

    private debugOnGridChanged(): void {
        if (DebugGameConfig.grid) {
            if (!this.debugGrid) {
                const debugGrid = this.debugGrid = new DebugGrid();
                this.add(debugGrid);
                debugGrid.create(DefaultWFCConfig.radius);
            } else {
                this.debugGrid.create(DefaultWFCConfig.radius);
            }
        } else {
            if (this.debugGrid) {
                this.remove(this.debugGrid);
                this.debugGrid = null;
            }
        }
    }

    private debugOnLayerShow(entityType: GenerateEntityType): void {
        this.hexTileInstances[entityType].forEach((hexTileInstance) => {
            if (DebugGameConfig.generateType[entityType].show) {
                hexTileInstance.visible = true;
            } else {
                hexTileInstance.visible = false;
            }
        });
    }

    private debugOnEntropyChanged(): void {
        if (DebugGameConfig.generateType[GenerateEntityType.Landscape].entropy) {
            if (!this.entropyHelper) {
                this.entropyHelper = new EntropyHelper();
                this.add(this.entropyHelper);
            }

            this.entropyHelper.show();
        } else {
            this.entropyHelper?.hide();
        }
    }

    private debugOnLandscapeRotationChanged(): void {
        this.hexTileInstances[GenerateEntityType.Landscape].forEach((hexTileInstance) => {
            hexTileInstance.enableDebug(DebugGameConfig.generateType[GenerateEntityType.Landscape].hexTileDebug);
        });
    }

    private debugOnCloudsShow(): void {
        if (CloudsConfig.show) {
            this.clouds.showInstant();
        } else {
            this.clouds.hideInstant();
        }
    }
}
