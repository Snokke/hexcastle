import * as THREE from 'three';
import { MaterialType } from '../../Data/Enums/MaterialType';
import Loader from '../Loader/AssetsLoader';
import { FlagVertexShader, FlagFragmentShader } from './Shaders/FlagShader';
import { SmokeFragmentShader, SmokeVertexShader } from './Shaders/SmokeShader';

export default class Materials {
    static instance: Materials;

    materials: { [key in MaterialType]?: THREE.Material } = {};

    private constructor() {
        this.initMaterials();
    }

    public static getInstance(): Materials {
        if (!Materials.instance) {
            Materials.instance = new Materials();
        }
        return Materials.instance;
    }

    private initMaterials(): void {
        this.initMainMaterial();
        this.initCloudMaterial();
        this.initTransparentMaterial();
        this.initTileDebugMaterials();
        this.initFlagMaterial();
        this.initSmokeMaterial();
    }

    private initMainMaterial(): void {
        const texture: THREE.Texture = Loader.assets['hexagons_medieval'] as THREE.Texture;
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;

        this.materials[MaterialType.Main] = new THREE.MeshLambertMaterial({
            map: texture,
        });
    }

    private initCloudMaterial(): void {
        const texture: THREE.Texture = Loader.assets['hexagons_medieval'] as THREE.Texture;
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;

        this.materials[MaterialType.Cloud] = new THREE.MeshLambertMaterial({
            map: texture,
            transparent: true,
            opacity: 0.9,
        });
    }

    private initTransparentMaterial(): void {
        this.materials[MaterialType.Transparent] = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.1,
            depthWrite: false,
        });
    }

    private initTileDebugMaterials(): void {
        this.materials[MaterialType.TileDebugGreen] = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.25,
            depthWrite: false,
        });

        this.materials[MaterialType.TileDebugRed] = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.4,
            depthWrite: false,
        });

        this.materials[MaterialType.TileDebugWhite] = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.5,
            depthWrite: false,
        });
    }

    private initFlagMaterial(): void {
        const texture: THREE.Texture = Loader.assets['hexagons_medieval'] as THREE.Texture;
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;

        this.materials[MaterialType.Flag] = new THREE.ShaderMaterial({
            vertexShader: FlagVertexShader,
            fragmentShader: FlagFragmentShader,
            uniforms: {
                map: { value: texture },
                time: { value: 0.0 },
            },
        });
    }

    private initSmokeMaterial(): void {
        const perlinTexture: THREE.Texture = Loader.assets['noiseTexture'] as THREE.Texture;
        perlinTexture.wrapS = THREE.RepeatWrapping;
        perlinTexture.wrapT = THREE.RepeatWrapping;

        this.materials[MaterialType.Smoke] = new THREE.ShaderMaterial({
            vertexShader: SmokeVertexShader,
            fragmentShader: SmokeFragmentShader,
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
            uniforms:
            {
                uTime: new THREE.Uniform(0),
                uPerlinTexture: { value: perlinTexture }
            },
        })
    }
}

Materials.instance = null;
