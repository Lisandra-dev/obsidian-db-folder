import { TableStateInterface } from "cdm/TableStateInterface";
import { DatabaseView } from "views/DatabaseView";
import useAutomationStore from "stateManagement/useAutomationStore";
import useColumnsStore from "stateManagement/useColumnsStore";
import useConfigStore from "stateManagement/useConfigStore";
import useDataStore from "stateManagement/useDataStore";
import useRowTemplateStore from "stateManagement/useRowTemplateStore";
import useSortingStore from "stateManagement/useSortingStore";

function useTableStore(view: DatabaseView): TableStateInterface {
  const automation = useAutomationStore(view);
  const config = useConfigStore(view);
  const data = useDataStore(view);
  const rowTemplate = useRowTemplateStore(view);
  const sorting = useSortingStore(view);
  const columns = useColumnsStore(view);
  return {
    configState: config,
    rowTemplate: rowTemplate,
    data: data,
    sorting: sorting,
    columns: columns,
    automations: automation,
  };
}

export default useTableStore;
