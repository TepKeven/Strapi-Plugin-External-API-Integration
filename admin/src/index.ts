import { prefixPluginTranslations } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';

export default {
  register(app: any) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: "Strapi External API Integration",
      },
      Component: async () => {
        const { App } = await import('./pages/App');
        return App;
      },
    });

    app.createSettingSection(
      {
        id: `${PLUGIN_ID}.section.setting`,
        intlLabel: {
          id: `${PLUGIN_ID}.section.setting`,
          defaultMessage: "External API Integration",
        },
      }, // Section to create
      [
        // links
        {
          intlLabel: { id: `${PLUGIN_ID}.setting.api`, defaultMessage: "API Endpoint Settings" },
          id:  `${PLUGIN_ID}.setting.api`,
          to: `plugins/${PLUGIN_ID}/apisetting`,
          Component: async () => {
            const APISetting = await import('./pages/APISetting');
            return APISetting;
          },
          permissions: [],
        },
      ]
    );

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  async registerTrads(app: any) {
    const { locales } = app;

    const importedTranslations = await Promise.all(
      (locales as string[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return importedTranslations;
  },
};
