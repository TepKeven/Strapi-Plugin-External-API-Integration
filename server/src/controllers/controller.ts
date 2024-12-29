import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from '../../../admin/src/pluginId'

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('strapi-plugin-external-api-integration')
      // the name of the service file & the method.
      .service('service')
      .getWelcomeMessage();
  },

  async getSettings(ctx){

    const pluginStore = strapi.store({
      type: 'plugin',
      name: PLUGIN_ID
    })

    const apiRoute = await pluginStore.get({
      key: "api-info"
    })

    ctx.body = apiRoute ?? {}
  },

  async setSettings(ctx){

    const {base_endpoint, find_all_api, find_one_api, create_api, update_api, delete_api, bearer_token} = ctx.request.body

    const pluginStore = strapi.store({
      type: 'plugin',
      name: PLUGIN_ID
    })

    await pluginStore.set({
      key: "api-info",
      value: {
        base_endpoint,
        find_all_api,
        find_one_api,
        create_api,
        update_api,
        delete_api,
        bearer_token
      }
    })

    ctx.body = {
      status: 200,
      message: "Settings Update Successfully"
    }
  }

});

export default controller;
