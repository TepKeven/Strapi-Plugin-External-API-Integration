import { DesignSystemProvider, Field, Button, Typography, TextButton, IconButton, Loader } from '@strapi/design-system'
import { Box, Flex } from '@strapi/design-system'
import { useFetchClient } from '@strapi/strapi/admin'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Minus, Plus } from '@strapi/icons'
import { PLUGIN_ID } from '../pluginId'


interface SettingResponse{
  base_endpoint: string
  find_all_api: string
  find_one_api: string
  create_api: string
  update_api: string
  delete_api: string
  bearer_token: string
}

export default function InfoPage(){

  const [entry, setEntry] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const { entity_id } = useParams();

  const { get } = useFetchClient();

  useEffect(() => {
    const getData = async () => {
      const { data }: {data: SettingResponse} = await get("/strapi-plugin-external-api-integration/setting") // grab the settings
      if(entity_id){
        const response = await axios.get(data.base_endpoint + data.find_one_api.replace(":id", entity_id ?? "1"), {
          headers: { Authorization: `Bearer ${data.bearer_token}` }
        }) // use those setting endpoints to grab the data
        setEntry(response.data)
      }
      else{
        const response = await axios.get(data.base_endpoint + data.find_all_api, {
          headers: { Authorization: `Bearer ${data.bearer_token}` }
        }) // use those setting endpoints to grab the data
        const sampleData = (response.data.length > 0) ? response.data[0] : {}
        setEntry(resetFieldsToEmptyString(sampleData))
      }

      setLoading(false)
    }

    getData()
  }, [])

  // Since we use delete keyword to maintain index and UI stability therefore we need to remove undefined index from the list before submitting
  const removeUndefinedItems = (objData: any) => {
    Object.keys(objData).map((key: any) => {

      if(Array.isArray(objData[key])){
        objData[key] = objData[key].filter((item: any) => {
          return item != undefined && item.length > 0
        })
      }
      else if(typeof objData[key] == 'object'){
        objData[key] = removeUndefinedItems(objData[key])
      }
    })

    return objData
  }

  // Generate required form inputs
  const generateRequiredInputs = (defaultValue: any, field_name: any) => {
    return (
      <Box paddingTop={3} key={field_name}>
        <Field.Root error="">
          <Field.Label>{field_name.split(".").pop()}</Field.Label>
          <Field.Input type="text" defaultValue={defaultValue} placeholder={defaultValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEntry(updateNestedObj(field_name.split("."), e.target.value, {...entry}))} />
          <Field.Error />
        </Field.Root>
      </Box>
    )
  }

  // In case the structure is an object we need to recursively create each input box for each object field and inner field
  const generateRequiredInputsObj = (object: any, field_name: any) => {
    return (
      <Box paddingTop={5} key={field_name}>
        <Box paddingBottom={2}>
          <Typography variant='beta'>
              {field_name.split(".").pop()}
          </Typography>
        </Box>
        {Object.keys(object).map((key: any) => (
          typeof object[key] == 'object' ? (
            generateRequiredInputsObj(object[key], field_name + "." + key)
          ) : (
            generateRequiredInputs(object[key], field_name + "." + key)
          )
        ))}
      </Box>
    )
  }

  // In case the structure is an array we need to recursively create each input box for each array item and inner items
  const generateRequiredInputsArray = (arr: any, field_name: any) => {
    return (
      <Box paddingTop={5} key={field_name}>
        <Flex paddingBottom={2} gap={3}>
          <Typography variant='beta'>
              {field_name.split(".").pop()}
          </Typography>
          <IconButton variant="default" label="Add Items" disabled={arr.length > 0 ? false : true} onClick={() => setEntry(updateNestedObj(field_name.split(".").concat(arr.length), resetFieldsToEmptyString((typeof arr[0] == 'object') ? {...arr[0]} : ""), {...entry}))}>
            <Plus />
          </IconButton>
        </Flex>
        {arr.map((item: any, index: number) => (
          <Flex gap={5} key={index}>
            <Box flex={10}>
              {
                Array.isArray(item) ?
                  generateRequiredInputsArray(item, field_name + "." + index)
                : (
                typeof item == 'object' ?
                  generateRequiredInputsObj(item, field_name + "." + index)
                :
                  generateRequiredInputs(item, field_name + "." + index)
                )
              }
            </Box>
            <Box flex={1}>
              <IconButton variant='danger' onClick={() => setEntry(deleteNestedObj(field_name.split(".").concat(index), {...entry}))}>
                <Minus />
              </IconButton>
            </Box>
          </Flex>
        ))}
      </Box>
    )
  }

  // This form builder depends on the JSON format to build the form,
  // so we need to reset those fields to "" for create endpoint to not have old data
  const resetFieldsToEmptyString = (objData: any) => {
    Object.keys(objData).map(key => {
      if(Array.isArray(objData[key])){
        objData[key] = resetFieldsToEmptyString([objData[key].shift()])
      }
      else if(typeof objData[key] == 'object' && objData[key] != null){
        objData[key] = resetFieldsToEmptyString(objData[key])
      }
      else{
        objData[key] = "";
      }
    })

    return objData;
  }

  // Instead of looping over all the keys, we can just directly create/update object field such as obj[key1][key2][key3] = new_value from this recursive function
  // It improves performance especially for large object
  // It also reduces the chance of updating the wrong field especially when the fields have the same name but on different level of the object
  function updateNestedObj(key_names: any[], new_value: any, object: any) {

    if(key_names.length == 1){
      object[key_names.shift() ?? ""] = new_value
    }
    else{
      let key: any = key_names.shift() ?? ""
      object[key] = updateNestedObj(key_names, new_value, object[key])
    }

    return object
  }

  // Delete nested object following the format above
  function deleteNestedObj(key_names: any[], object: any){
    if(key_names.length == 1){

      if(object.filter((obj: any) => obj != undefined).length > 1){
        delete object[key_names.shift()]
        // object.splice(key_names.shift(), 1) // splice reset the index therefore React cant track the key and mess up the UI
      }
      else{
        alert("Unable to delete the last item. We need this for our templating.")
      }
    }
    else{
      const key = key_names.shift()
      object[key] = deleteNestedObj(key_names, object[key])
    }
    return object
  }

  // Create or Update existing entity
  const createOrSaveEntity = async () => {
    const { data }: {data: SettingResponse} = await get("/strapi-plugin-external-api-integration/setting") // grab the settings

    const submittedEntry = removeUndefinedItems(entry)

    try{
      if(entity_id){
        const response = await axios.put(data.base_endpoint + data.update_api.replace(":id", entity_id ?? ""), submittedEntry, {
          headers: { Authorization: `Bearer ${data.bearer_token}` }
        }) // use those setting endpoints to update the data
        alert("Your entry has been updated");
      }
      else{
        const response = await axios.post(data.base_endpoint + data.create_api, submittedEntry, {
          headers: { Authorization: `Bearer ${data.bearer_token}` }
        }) // use those setting endpoints to update the data
        alert("Your entry has been created");
      }
    }
    catch(e: any){
      console.log(e)
      alert("There was an error occurred. Please check the console.log")
    }
    finally{
      console.log(submittedEntry)
    }
  }

  if(loading){
    return  <Flex direction="row" justifyContent="center" alignItems="center" height="100vh">
      <Loader />
    </Flex>
  }

  return (
    <DesignSystemProvider>
      <Box padding={8} background="neutral100">
        <Box marginBottom={6}>
          <TextButton startIcon={<ArrowLeft />} onClick={() => window.location.assign(`/admin/plugins/${PLUGIN_ID}`)}>Back</TextButton>
          <Box marginBottom={1} marginTop={4}>
            <Typography variant='alpha'>{entity_id ? "Edit" : "Create"} Entry</Typography>
          </Box>
          <Typography>View & {entity_id ? "Edit" : "Create"} Entry</Typography>
        </Box>
        {Object.keys(entry).map((key: any) => (
          Array.isArray(entry[key]) ? (
            generateRequiredInputsArray(entry[key], key)
          ) : (
            typeof entry[key] == 'object' ? (
              generateRequiredInputsObj(entry[key], key)
            ) : (
              generateRequiredInputs(entry[key], key)
            )
          )
        ))}
        <Box paddingTop={5}>
            <Button onClick={createOrSaveEntity}>{entity_id ? "Save Changes" : "Create Entity"}</Button>
        </Box>
      </Box>
    </DesignSystemProvider>
  )
}
