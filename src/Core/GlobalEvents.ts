// src/Core/EventBus.ts
import mitt, { Emitter } from 'mitt';
import { ButtonType } from '../Data/Enums/ButtonType';

export type GlobalEvents = {
    'game:generate': void;
    'game:stopGenerate': void;
    'game:fieldRadiusChanged': number;
    'game:startGeneratingWorld': void;
    'game:progressGeneratingWorld': number;
    'game:finishGeneratingWorld': void;
    'game:startInteractionOrbitControls': void;
    'game:generateStarted': number;
    'game:pressKey': ButtonType;

    'ui:sliderPointerDown': void;
    'ui:sliderPointerUp': void;
    'ui:sliderIncreaseRadius': void;
    'ui:sliderDecreaseRadius': void;

    'debug:fpsMeterChanged': void;
    'debug:rendererStatsChanged': void;
    'debug:gridChanged': void;
    'debug:landscapeShow': void;
    'debug:maxFieldRadiusChanged': void;
    'debug:entropyChanged': void;
    'debug:landscapeRotationChanged': void;
    'debug:wallsShow': void;
    'debug:cityShow': void;
    'debug:natureShow': void;
    'debug:cloudsShow': void;
};

export const GlobalEventBus: Emitter<GlobalEvents> = mitt<GlobalEvents>();