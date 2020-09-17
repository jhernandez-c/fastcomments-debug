import {FastCommentsConfig} from "./fastcomments-config-interface";
import {ConfigDescriptions} from "./fastcomments-config-descriptions";
import {ConfigValueTransformerByType, ConfigValueTransformers} from "./fastcomments-config-value-transformers";

export default function configToViewModel(config: FastCommentsConfig): Record<string, string> {
    const result = {};
    for (const key in config) {
        // @ts-ignore
        let value = config[key];
        // @ts-ignore
        if (ConfigValueTransformers[key]) {
            // @ts-ignore
            value = ConfigValueTransformers[key](value);
        }
        // @ts-ignore
        if (ConfigValueTransformerByType[typeof key]) {
            // @ts-ignore
            value = ConfigValueTransformerByType[typeof key](value);
        }
        // @ts-ignore
        result[ConfigDescriptions[key] ? ConfigDescriptions[key] : key] = value;
    }
    return result;
}