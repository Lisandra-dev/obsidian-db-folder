import { DataviewFiltersProps } from "cdm/ComponentsModel";
import { DatabaseColumn } from "cdm/DatabaseModel";
import { obtainColumnsFromRows } from "components/Columns";
import MenuDownIcon from "components/img/MenuDownIcon";
import { FiltersModal } from "components/modals/filters/FiltersModal";
import { c } from "helpers/StylesHelper";
import React from "react";

export default function EditFiltersButton(props: DataviewFiltersProps) {
  const { table } = props;
  const { tableState, view } = table.options.meta;
  const [configInfo, filters] = tableState.configState((state) => [
    state.info,
    state.filters,
    state.actions,
  ]);
  const columns = tableState.columns((state) => state.columns);

  const openFiltersGroupHandler = () => {
    new Promise<Record<string, DatabaseColumn>>((resolve, reject) => {
      // Empty conditions to refresh the dataview
      const emptyFilterConditions = { ...filters };
      emptyFilterConditions.conditions = [];
      resolve(
        obtainColumnsFromRows(
          view,
          configInfo.getLocalSettings(),
          emptyFilterConditions,
          columns
        )
      );
    }).then((columns) => {
      new FiltersModal({
        table,
        possibleColumns: Object.keys(columns).sort((a, b) =>
          a.localeCompare(b)
        ),
      }).open();
    });
  };
  return (
    <button
      type="button"
      onClick={openFiltersGroupHandler}
      key={`Button-FilterConditions-DataviewFilters`}
      className={c("nabvar-button")}
    >
      <span
        className="svg-icon svg-gray"
        key={`Span-FilterConditions-Ref-Portal`}
      >
        <MenuDownIcon />
      </span>
    </button>
  );
}
