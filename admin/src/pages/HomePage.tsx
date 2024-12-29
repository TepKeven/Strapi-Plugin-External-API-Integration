

import { IconButton, EmptyStateLayout, Typography, Checkbox, DesignSystemProvider, Button, Loader, Link, LinkButton, Modal } from "@strapi/design-system";
import { useEffect, useState } from 'react';
import { PLUGIN_ID } from '../pluginId';
import Illo from '../components/Illo'

import {
  Table,
  Thead,
  TFooter,
  Tbody,
  Tr,
  Td,
  Th,
} from "@strapi/design-system";
import {Pencil, Plus, Trash, WarningCircle} from "@strapi/icons";
import { Box, Flex } from '@strapi/design-system';
import axios from 'axios'
import { useFetchClient } from "@strapi/strapi/admin";
import { Dialog } from "@strapi/design-system";

const HomePage = () => {

  const ROW_COUNT = 6;
  const COL_COUNT = 10;

  interface SettingResponse{
    base_endpoint: string
    find_all_api: string
    find_one_api: string
    create_api: string
    update_api: string
    delete_api: string
    bearer_token: string
  }

  const { get } = useFetchClient();
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState<Boolean>(true)
  const [headers, setHeaders] = useState<any>([])

  useEffect(() => {

    const getData = async () => {

      const { data }: {data: SettingResponse} = await get("/strapi-plugin-external-api-integration/setting") // grab the settings
      const response = await axios.get(data.base_endpoint + data.find_all_api, {
        headers: { Authorization: `Bearer ${data.bearer_token}` }
      }) // use those setting endpoints to grab the data
      setEntries(response.data)
      const sample = response.data.length > 0 ? response.data[0] : {}
      setHeaders(Object.keys(sample))
      setLoading(false)
    }

    getData()
  }, [])

  if(loading){
    return  <Flex direction="row" justifyContent="center" alignItems="center" height="100vh">
      <Loader />
    </Flex>
  }

  // In case the structure is an object we need to recursively display each field of the object and its inner fields
  const generateObjectStructue = (objectData: any, indent: number) => {
    return (
      <>
       {Object.keys(objectData).map((key: string) => {
          return (
            <Typography key={key}>
                {typeof objectData[key] == 'object' ? (
                  <>
                  <Box fontWeight="bold">
                      {`${"-".repeat(indent)} ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                  </Box>
                  {generateObjectStructue(objectData[key], indent + 1)}
                  </>
                ) : (
                  Array.isArray(objectData[key]) ? (
                    generateArrayStructure(objectData[key], key, indent + 1)
                  ) : (
                    <Box>
                      {`${"-".repeat(indent)} ${key.charAt(0).toUpperCase() + key.slice(1)}: ${objectData[key]}`}
                    </Box>
                  )
                )}
            </Typography>

          )
        })
       }
      </>
    )
  }

  // In case the structure is an array we need to recursively display each item and the item's inner fields if the item is an object
  const generateArrayStructure = (arrayData: any[], header: string|number, indent: number) => {
    return (
      <>
       {arrayData.map((item: string) => {
          return (
            <Typography key={item}>
                <Box fontWeight="bold">
                    {header}
                </Box>
                {typeof item == 'object' ? (
                  generateObjectStructue(item, indent + 1)
                ) : (
                  Array.isArray(item) ? (
                    generateArrayStructure(item, indent, indent + 1)
                  ) : (
                    <Box>
                      {`${"-".repeat(indent)} ${item}`}
                    </Box>
                  )
                )}
            </Typography>

          )
        })
       }
      </>
    )
  }

  // Delete selected entry
  const deleteEntry = async (entry_id: any) => {
    const { data }: {data: SettingResponse} = await get("/strapi-plugin-external-api-integration/setting") // grab the settings
    const response = await axios.delete(data.base_endpoint + data.delete_api.replace(":id", entry_id), {
      headers: { Authorization: `Bearer ${data.bearer_token}` }
    }) // use those setting endpoints to delete the data
    alert("Your entry has been deleted")
    window.location.reload()
  }

  return (
    <DesignSystemProvider>
      <Box padding={8} background="neutral100">
        <Flex justifyContent="space-between">
          <Box marginBottom={6}>
            <Box marginBottom={1} marginTop={4}>
              <Typography variant='alpha'>List of Entries</Typography>
            </Box>
            <Typography>{`${entries.length} entries found`}</Typography>
          </Box>
          <LinkButton
            href={`${PLUGIN_ID}/create`}
            size="M"
            variant="default"
          >
            + Create new Entry
          </LinkButton>
        </Flex>
        {entries.length > 0 ? (
          <Table colCount={COL_COUNT} rowCount={ROW_COUNT} footer={<TFooter icon={<Plus />} onClick={() => window.location.assign(`${PLUGIN_ID}/create`)}>Add another record to this collection type</TFooter>}>
          <Thead>
            <Tr>
              <Th>
                <Checkbox aria-label="Select all entries" />
              </Th>
              {headers.map((header: string) =>
                <Th key={header}>
                  <Typography variant="sigma">{header}</Typography>
                </Th>
              )}
              <Th>
                {/* <VisuallyHidden>Actions</VisuallyHidden> */}
                <Typography variant="sigma">Actions</Typography>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {entries.map((entry: any, index: number) =>
              <Tr key={entry.id ?? index}>
                <Td>
                  <Checkbox aria-label={`Select ${entry}`} />
                </Td>
                {headers.map((header: string) =>
                   <Td key={header + (entry.id ?? index)}>
                     {typeof entry[header] === 'string' && entry[header].includes("http") ? (
                        <Link href={entry[header]} isExternal>
                          {header}
                        </Link>
                     ) : (
                        <Typography textColor="neutral800">
                          {
                            (typeof entry[header] === 'object')
                            ? generateObjectStructue(entry[header], 0)
                            : (
                              Array.isArray(entry[header])
                              ? generateArrayStructure(entry[header], header, 0)
                              : ((header in entry) ? entry[header].toString() : "")
                            )
                          }
                        </Typography>
                     )}
                   </Td>
                )}
                <Td>
                  <Flex gap={2}>
                    <IconButton onClick={() => window.location.assign(`${PLUGIN_ID}/${entry.id ?? index}`)} label="Edit" borderWidth={0}>
                      <Pencil />
                    </IconButton>
                    <Dialog.Root>
                      <Dialog.Trigger>
                        <IconButton label='Delete'>
                          <Trash />
                        </IconButton>
                      </Dialog.Trigger>
                      <Dialog.Content>
                        <Dialog.Header>Delete Confirmation (Entry {entry.id ?? `${index + 1} Row Position`})</Dialog.Header>
                        <Dialog.Body icon={<WarningCircle fill="danger600" />}>Are you sure you want to delete this?</Dialog.Body>
                        <Dialog.Footer>
                          <Dialog.Cancel>
                            <Button fullWidth variant="primary">
                              Cancel
                            </Button>
                          </Dialog.Cancel>
                          <Dialog.Action>
                            <Button fullWidth label="Delete" borderWidth={0} variant='danger' onClick={() => deleteEntry(entry.id ?? "")}>
                              Yes, delete
                            </Button>
                          </Dialog.Action>
                        </Dialog.Footer>
                      </Dialog.Content>
                    </Dialog.Root>
                  </Flex>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
        ) : (
          <EmptyStateLayout
            icon={<Illo />}
            content="You don't have any data yet..."
            action={
              <Button
                onClick={() => window.location.assign(`${PLUGIN_ID}/create`)}
                variant="secondary"
                startIcon={<Plus />}
              >
                Add your first data
              </Button>
            }

          />
        )}
      </Box>
    </DesignSystemProvider>
  );
};

export { HomePage };
