import { Field, Button, Typography } from '@strapi/design-system'
import { Box } from '@strapi/design-system'
import { useFetchClient } from '@strapi/strapi/admin'
import React, { useEffect, useState } from 'react'


interface SaveSettingResponse{
  status: number
  message: string
}

interface GetSettingResponse{
  base_endpoint: string
  find_all_api: string
  find_one_api: string
  create_api: string
  update_api: string
  delete_api: string
  bearer_token: string
}

export default function APISetting(){

  const [baseEndpoint, setBaseEndpoint] = useState("")
  const [listEndpoint, setListEndpoint] = useState("")
  const [findOneEndpoint, setFindOneEndpoint] = useState("")
  const [createEndpoint, setCreateEndpoint] = useState("")
  const [updateEndpoint, setUpdateEndpoint] = useState("")
  const [deleteEndpoint, setDeleteEndpoint] = useState("")
  const [bearerToken, setBearerToken] = useState("")

  const { get, post } = useFetchClient();

  // Save API endpoint settings
  const saveSettings = async () => {

    const { data }: {data: SaveSettingResponse} = await post("/strapi-plugin-external-api-integration/setting", {
      base_endpoint: baseEndpoint.replace(/^\/+|\/+$/g, ''),
      find_all_api: "/" + listEndpoint.replace(/^\/+|\/+$/g, ''),
      find_one_api: "/" + findOneEndpoint.replace(/^\/+|\/+$/g, ''),
      create_api: "/" + createEndpoint.replace(/^\/+|\/+$/g, ''),
      update_api: "/" + updateEndpoint.replace(/^\/+|\/+$/g, ''),
      delete_api: "/" + deleteEndpoint.replace(/^\/+|\/+$/g, ''),
      bearer_token: bearerToken
    })

    alert(data.message)
  }

  useEffect(() => {
    const getData = async () => {
      const { data }: {data: GetSettingResponse} = await get("/strapi-plugin-external-api-integration/setting");
      setBaseEndpoint(data.base_endpoint)
      setListEndpoint(data.find_all_api)
      setFindOneEndpoint(data.find_one_api)
      setCreateEndpoint(data.create_api)
      setUpdateEndpoint(data.update_api)
      setDeleteEndpoint(data.delete_api)
      setBearerToken(data?.bearer_token)
    }

    getData()
  }, [])

  return (
    <Box padding={8} background="neutral100">
      <Box marginBottom={6}>
        <Box marginBottom={2}>
          <Typography variant='alpha'>API Endpoint Settings</Typography>
        </Box>
        <Typography>API Endpoint Configuration</Typography>
      </Box>
      <Box paddingBottom={5}>
        <Field.Root error="">
          <Field.Label>Base API Endpoint</Field.Label>
          <Field.Input type="text" defaultValue={baseEndpoint} placeholder="https://api.keven.com/api/v1" endAction={<Box padding={1} background="primary500" color="white" borderRadius={1}>BASE</Box>} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBaseEndpoint(e.target.value)} />
          <Field.Error />
        </Field.Root>
      </Box>
      <Box paddingBottom={5}>
        <Field.Root error="">
          <Field.Label>List Endpoint</Field.Label>
          <Field.Input type="text" defaultValue={listEndpoint} placeholder="/users" endAction={<Box padding={1} background="success500" color="white" borderRadius={1}>GET</Box>} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setListEndpoint(e.target.value)}/>
          <Field.Error />
        </Field.Root>
      </Box>
      <Box paddingBottom={5}>
        <Field.Root error="">
          <Field.Label>Find One Endpoint</Field.Label>
          <Field.Input type="text" defaultValue={findOneEndpoint} placeholder="/users/:id" endAction={<Box padding={1} background="success500" color="white" borderRadius={1}>GET</Box>} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFindOneEndpoint(e.target.value)} />
          <Field.Error />
        </Field.Root>
      </Box>
      <Box paddingBottom={5}>
        <Field.Root error="">
          <Field.Label>Create Endpoint (PS: Please have at least 1 entity in the List endpoint so we can generate a form based on the data)</Field.Label>
          <Field.Input type="text" defaultValue={createEndpoint} placeholder="/users" endAction={<Box padding={1} background="primary500" color="white" borderRadius={1}>POST</Box>} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreateEndpoint(e.target.value)} />
          <Field.Error />
        </Field.Root>
      </Box>
      <Box paddingBottom={5}>
        <Field.Root error="">
          <Field.Label>Update Endpoint</Field.Label>
          <Field.Input type="text" defaultValue={updateEndpoint} placeholder="/users/:id" endAction={<Box padding={1} background="primary500" color="white" borderRadius={1}>PUT</Box>} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdateEndpoint(e.target.value)} />
          <Field.Error />
        </Field.Root>
      </Box>
      <Box paddingBottom={5}>
        <Field.Root error="">
          <Field.Label>Delete Endpoint</Field.Label>
          <Field.Input type="text" defaultValue={deleteEndpoint} placeholder="/users/:id" endAction={<Box padding={1} background="danger500" color="white" borderRadius={1}>DELETE</Box>} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeleteEndpoint(e.target.value)} />
          <Field.Error />
        </Field.Root>
      </Box>
      <Box paddingBottom={5}>
        <Field.Root error="">
          <Field.Label>API Bearer Token</Field.Label>
          <Field.Input type="text" defaultValue={bearerToken} placeholder="Required for Private APIs" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBearerToken(e.target.value)} />
          <Field.Error />
        </Field.Root>
      </Box>
      <Button onClick={saveSettings}>Save</Button>
    </Box>
  )
}
