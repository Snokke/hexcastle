import { Pane } from 'tweakpane';
import { DebugConfig } from '../../Data/Configs/Debug/DebugConfig';
import isMobile from 'ismobilejs';
import queryString from 'query-string';

export default class GUIHelper {
    static instance: GUIHelper;

    private gui: any;

    constructor() {
        this.gui = new Pane({
            title: 'Control panel',
        });

        this.gui.hidden = true;
        this.gui.containerElem_.style.width = '275px';

        this.gui.expanded = false;

        GUIHelper.instance = this;

        return this.gui;
    }

    public getFolder(name: string): any {
        const folders = this.gui.children;

        for (let i = 0; i < folders.length; i += 1) {
            const folder = folders[i];

            if (folder.title === name) {
                return folder;
            }
        }

        return null;
    }

    public getController(folder: any, name: string): any {
        for (let i = 0; i < folder.children.length; i += 1) {
            const controller = folder.children[i];

            if (controller.label === name) {
                return controller;
            }
        }

        return null;
    }

    public getControllerFromFolder(folderName: string, controllerName: string): any {
        const folder = this.getFolder(folderName);

        if (folder) {
            return this.getController(folder, controllerName);
        }

        return null;
    }

    public showAfterAssetsLoad(): void {
        const isMobileDevice = isMobile(window.navigator).any;
        let debugEnableGUI = false;

        if (isMobileDevice) {
            debugEnableGUI = DebugConfig.gui.mobile;
        } else {
            debugEnableGUI = DebugConfig.gui.desktop;
        }

        const parsed = queryString.parse(location.search);

        if ('debug' in parsed || debugEnableGUI) {
            this.gui.hidden = false;
        }
    }

    public static getGui() {
        return GUIHelper.instance.gui;
    }

    public static getFolder(name: string) {
        return GUIHelper.instance.getFolder(name);
    }

    public static getController(folder: any, name: string) {
        return GUIHelper.instance.getController(folder, name);
    }

    public static getControllerFromFolder(folderName: string, controllerName: string) {
        return GUIHelper.instance.getControllerFromFolder(folderName, controllerName);
    }
}

GUIHelper.instance = null;
