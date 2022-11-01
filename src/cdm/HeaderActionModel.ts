import { HeaderMenuProps } from "cdm/HeaderModel";

export type HeaderActionResponse = {
    buttons: JSX.Element[]
    headerMenuProps: HeaderMenuProps
    hooks: {
        setExpanded: (expanded: boolean) => void,
        setKeyState: (key: string) => void,
        keyState: string,
        [key: string]: any | ((a: any) => void)
    }
}

export type HeaderActionModel = {
    label: string;
    icon: React.ReactNode;
    onClick: (e: any) => Promise<void>;
};
export interface HeaderAction {
    setNext(handler: HeaderAction): HeaderAction;
    handle(settingHandlerResponse: HeaderActionResponse): HeaderActionResponse;
}