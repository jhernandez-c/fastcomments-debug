import {FastCommentsConfig} from "./fastcomments-config-interface";

export interface WidgetInstanceInterface {
    element: Element
    config: FastCommentsConfig
    configViewModel: Record<string, string> // for example, has "Yes" instead of "true" for values
    requested?: boolean
}
