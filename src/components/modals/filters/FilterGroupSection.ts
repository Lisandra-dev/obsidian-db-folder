import { FiltersModalHandlerResponse } from "cdm/ModalsModel";
import { AbstractChain } from "patterns/chain/AbstractFactoryChain";
import { AbstractHandler } from "patterns/chain/AbstractHandler";
import { FilterGroupHandler } from "components/modals/filters/handlers/FilterGroupHandler";
import { AddNewFilterHandler } from "components/modals/filters/handlers/AddNewFilterHandler";

class FilterGroupSection extends AbstractChain<FiltersModalHandlerResponse> {
    protected getHandlers(): AbstractHandler<FiltersModalHandlerResponse>[] {
        return [
            new FilterGroupHandler(),
            new AddNewFilterHandler()
        ];
    }
}

export const filter_group_section = new FilterGroupSection();