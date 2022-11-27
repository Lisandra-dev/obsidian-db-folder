import {
    App
} from 'obsidian';

import {
    FolderModel
} from 'cdm/FolderModel';

import { DatabaseSettings } from 'cdm/SettingsModel';

export interface DbfAPIInterface {
    app: App;
    settings: DatabaseSettings;

    /** Obtain model using key name */
    obtainFolderModel(key: string): FolderModel;
}