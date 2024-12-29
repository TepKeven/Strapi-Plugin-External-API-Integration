# 🚀 Getting started with strapi-plugin-external-api-integration

## Technical details

CMS Platform: [Strapi Headless CMS](https://strapi.io/)

This plugin enables integrations with `External API Endpoints` allowing for `CRUD` operations (List, View, Edit & Delete)
to be done directly between `Strapi` & the external apis instead of the normal direct manipulation of data within the database.  

## Supported features
- List available entries 
- Create new entry (The form will be generated based on the initial JSON List response)
- View entry (The form will be generated based on the selected object)
- Update entry (The request body will be in the same format as the selected item response)
- Delete entry 
- Bearer Authorization Token

## Strapi Plugin External APIs Configuration Settings 
![Screen 3](./screenshots/screen3.png)

## Strapi Plugin List & View Page
![Screen 1](./screenshots/screen1.png)
![Screen 2](./screenshots/screen2.png)

## Plugin history

- `1.0`
  - CRUD operatons (List, View, Edit & Delete)
  - Bearer Authorization Token
  - External API endpoints configuration
  - Support text input 
  - Support array items (object & string)

## Future plans 

- `1.1`
  - Provide support regarding datetime, textarea & relational field 
  - Provide support for pagination & search filters 

## Installation Guidelines 
  - Create a folder following this path: `src/plugins`
  - `cd` into the folder and clone this git repository
  - Rename the cloned folder to `strapi-plugin-external-api-integration` 
  - The path should look like `src/plugins/strapi-plugin-external-api-integration`
  - In the `config/plugins.js|ts` file, add the following lines of code: 
  ```javascript
  'strapi-plugin-external-api-integration': {
    enabled: true,
    resolve: './src/plugins/strapi-plugin-external-api-integration'
  },
  ```

## Additional Notes 
 - This plugin uses recursive functions to generate form inputs, display data and modify data at certain level of the object. 
   If the JSON format is too complex, then data visualization and form generation might be affected. 
 - This plugin is implemented in Typescript. 
