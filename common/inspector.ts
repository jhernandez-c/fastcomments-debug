import {FastCommentsConfig} from "./fastcomments-config-interface";

export interface WidgetInstance {
    element: Element
    config: FastCommentsConfig

}

export interface InspectionResult {
    widgetInstances: WidgetInstance[]
}

export class Inspector {
    static inspectDOM() : InspectionResult[] {
        return [
            {
                widgetInstances: [
                ]
            }
        ];
    }
}
