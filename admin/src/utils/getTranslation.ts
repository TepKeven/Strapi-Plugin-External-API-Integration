import { PLUGIN_ID } from '../pluginId';

const getTranslation = (id: string) => `${PLUGIN_ID}.${id}`;

const prefixPluginTranslations = (data: Record<string, string>) => {
  return Object.keys(data).reduce((obj, current) => {
    obj[getTranslation(current)] = data[current];
    return obj;
  }, {} as Record<string, string>);
}

export { prefixPluginTranslations };
