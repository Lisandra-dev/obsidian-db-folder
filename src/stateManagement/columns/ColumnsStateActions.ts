import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractChain } from "patterns/chain/AbstractFactoryChain";
import DeleteColumnHandlerAction from "stateManagement/columns/handlers/DeleteColumnAction";
import InsertColumnHandlerAction from "stateManagement/columns/handlers/NewColumnAction";
import AlterSortingColumnHandlerAction from "stateManagement/columns/handlers/AlterSortingColumnAction";
import AlterOptionToColumnHandlerAction from "stateManagement/columns/handlers/AlterOptionToColumnAction";
import AlterColumnTypeHandlerAction from "stateManagement/columns/handlers/AlterColumnTypeAction";
import AlterColumnLabelHandlerAction from "stateManagement/columns/handlers/AlterColumnLabelAction";
import AlterColumnSizeHandlerAction from "stateManagement/columns/handlers/AlterColumnSizeAction";
import InfoColumnFunctions from "stateManagement/columns/handlers/InfoColumnFunctions";
import AlterIsHiddenColumnHandlerAction from "stateManagement/columns/handlers/AlterIsHiddenColumnAction";
import AlterColumnIdHandlerAction from "stateManagement/columns/handlers/AlterColumnIdAction";
import AlterColumnConfigAction from "stateManagement/columns/handlers/AlterColumnConfigAction";
import { AbstractHandler } from "patterns/chain/AbstractHandler";
class ColumnsStateActions extends AbstractChain<TableActionResponse<ColumnsState>> {
    protected getHandlers(): AbstractHandler<TableActionResponse<ColumnsState>>[] {
        return [
            new InsertColumnHandlerAction(),
            new DeleteColumnHandlerAction(),
            new AlterSortingColumnHandlerAction(),
            new AlterOptionToColumnHandlerAction(),
            new AlterColumnTypeHandlerAction(),
            new AlterColumnLabelHandlerAction(),
            new AlterColumnSizeHandlerAction(),
            new AlterIsHiddenColumnHandlerAction(),
            new InfoColumnFunctions(),
            new AlterColumnIdHandlerAction(),
            new AlterColumnConfigAction()

        ];
    }
}

const column_state_actions = new ColumnsStateActions();
export default column_state_actions;