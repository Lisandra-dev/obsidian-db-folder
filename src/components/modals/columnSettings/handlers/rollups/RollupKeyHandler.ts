import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
import { Setting } from "obsidian";
import { StringSuggest } from "settings/suggesters/StringSuggester";
import { recordFieldsFromRelation } from "helpers/RelationHelper";
import { ROLLUP_EMBED_ACTIONS } from "helpers/Constants";
import { t } from "lang/helpers";
export class RollupKeyHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse>  {
    settingTitle: string = t("column_settings_modal_rollup_key_title");
    handle(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = columnHandlerResponse;
        const { view, columnsState, configState } = columnSettingsManager.modal;
        const { config } = column
        const allColumns = columnsState.info.getAllColumns();

        // select key column (if action allows it)
        const isKeyRequiredByAction = !Object
            .values(ROLLUP_EMBED_ACTIONS)
            .contains(config.rollup_action);
        if (isKeyRequiredByAction) {
            const relationColumn = allColumns.find((col) => col.id === config.asociated_relation_id);
            const rollup_key_promise = async (value: string): Promise<void> => {
                // Persist on disk
                await view.diskConfig.updateColumnConfig(column.id, {
                    rollup_key: value
                });
                columnSettingsManager.modal.enableReset = true;
            };
            recordFieldsFromRelation(
                relationColumn.config.related_note_path,
                configState.info.getLocalSettings(),
                allColumns
            ).then((fields) => {
                new Setting(containerEl)
                    .setName(this.settingTitle)
                    .setDesc(t("column_settings_modal_rollup_key_desc"))
                    .addSearch((cb) => {
                        new StringSuggest(
                            cb.inputEl,
                            fields
                        );
                        cb.setPlaceholder(t("column_settings_modal_rollup_key_placeholder"))
                            .setValue(column.config.rollup_key)
                            .onChange(rollup_key_promise);
                    });
                return this.goNext(columnHandlerResponse);
            });
        } else {
            return this.goNext(columnHandlerResponse);
        }
    }
}