import { auth } from './dynamoLocalAccess.json'
import DynamoAllInOne from '../lib/index'

/* eslint-disable no-undef */
// Dynamo instance
const dynamo = new DynamoAllInOne({
  accessKeyId: auth.accessKey,
  region: auth.region,
  secretKeyId: auth.secretKey,
  endpoint: auth.endpoint
})

test('Table is being created and deleted', async () => {
  await dynamo.createTable({
    tableName: 'TableTest1',
    tablePrimaryKey: {
      partitionKey: {
        partitionKeyName: 'id',
        partitionKeyType: 'S'
      }
    },
    provisionedThroughput: {
      readUnits: 40000,
      writeUnits: 40000
    }
  })

  const tableTest1Exists = await dynamo.tableExists('TableTest1')
  expect(tableTest1Exists).toBeTruthy()

  // Deletes the table
  await dynamo.deleteTable('TableTest1')
  const tableTest1ExistsAfterDelete = await dynamo.tableExists('TableTest1')
  expect(tableTest1ExistsAfterDelete).toBeFalsy()

  // Checks if a random table does not exists
  expect(await dynamo.tableExists('Blablabla')).toBeFalsy()
})
