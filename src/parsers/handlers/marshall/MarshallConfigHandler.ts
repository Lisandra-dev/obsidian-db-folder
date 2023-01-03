import { YamlHandlerResponse } from 'cdm/MashallModel';
import { LocalSettings } from 'cdm/SettingsModel';
import { DEFAULT_SETTINGS } from 'helpers/Constants';
import { Literal } from 'obsidian-dataview';
import { unEscapeSpecialCharacters } from 'parsers/EscapeHelper';
import { AbstractYamlHandler } from 'parsers/handlers/marshall/AbstractYamlPropertyHandler';
import { DataviewService } from 'services/DataviewService';

export class MarshallConfigHandler extends AbstractYamlHandler {
    handlerName = 'configuration';

    public handle(handlerResponse: YamlHandlerResponse): YamlHandlerResponse {
        const { yaml } = handlerResponse;
        if (this.checkNullable(yaml.config)) {
            yaml.config = DEFAULT_SETTINGS.local_settings;
            this.addError(`configuration was null or undefined, using default configuration instead`);
        } else {
            Object.entries(DEFAULT_SETTINGS.local_settings).forEach(([key, value]) => {

                if (this.checkNullable(yaml.config[key as keyof LocalSettings])) {
                    yaml.config = this.loadDefaultConfig(key as keyof LocalSettings, value, yaml.config);
                    if (value !== "") {
                        this.addError(`There was not "${key}" key in yaml. Default value "${value}" will be loaded`);
                    }
                }
                // Check type of default value
                if (typeof value === "boolean") {
                    yaml.config = this.parseBoolean(key as keyof LocalSettings, yaml.config);
                }
            });
        }
        handlerResponse.yaml = yaml;
        return this.goNext(handlerResponse);
    }

    loadDefaultConfig<K extends keyof LocalSettings>(key: K, value: Literal, localSettings: LocalSettings): LocalSettings {
        const wrappedLiteral = DataviewService.wrapLiteral(value)
        let unEscapedValue = wrappedLiteral.value
        if (wrappedLiteral.type === "string") {
            unEscapedValue = unEscapeSpecialCharacters(wrappedLiteral.value)
        }
        localSettings[key] = unEscapedValue as any;
        return localSettings;
    }

    checkNullable<T>(value: T): boolean {
        return value === null || value === undefined;
    }

    parseBoolean<K extends keyof LocalSettings>(key: K, localSettings: LocalSettings): LocalSettings {
        const parsedValue = localSettings[key].toString().toLowerCase() === 'true';
        localSettings[key] = parsedValue as any;
        return localSettings;
    }
}

