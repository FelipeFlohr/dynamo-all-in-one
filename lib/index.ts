import { DynamoDB } from 'aws-sdk'
import { DynamoAuthConfigs } from './types/Auth'
import { DynamoItem } from './types/Item'
import { CreateTableConfigs, DynamoProvisionedThroughput, SecondaryIndexes, TablePrimaryKey } from './types/Table'

class DynamoAllInOne {
  public readonly dynamo: DynamoDB
  private readonly configs: DynamoAuthConfigs

  public constructor (configs: DynamoAuthConfigs) {
    this.configs = configs
    this.dynamo = new DynamoDB({
      credentials: {
        accessKeyId: configs.accessKeyId,
        secretAccessKey: configs.secretKeyId
      },
      region: configs.region,
      endpoint: configs.endpoint
    })
  }

  public async createTable (configs: CreateTableConfigs) {
    const generateKeySchema = (primaryKey: TablePrimaryKey): DynamoDB.KeySchema => {
      const result = [
        {
          AttributeName: primaryKey.partitionKey.partitionKeyName,
          KeyType: 'HASH'
        }
      ]

      if (primaryKey.sortKey) {
        result.push({
          AttributeName: primaryKey.sortKey.sortKeyName,
          KeyType: 'RANGE'
        })
      }

      return result
    }

    const generateAttributeDefinitions = (primaryKey: TablePrimaryKey): DynamoDB.AttributeDefinitions => {
      const result = [
        {
          AttributeName: primaryKey.partitionKey.partitionKeyName,
          AttributeType: primaryKey.partitionKey.partitionKeyType
        }
      ]
      if (primaryKey.sortKey) {
        result.push({
          AttributeName: primaryKey.sortKey.sortKeyName,
          AttributeType: primaryKey.sortKey.sortKeyType
        })
      }

      return result
    }

    const generateLocalSecondaryIndexes = (secondaryIndexes?: SecondaryIndexes): DynamoDB.LocalSecondaryIndexList | undefined => {
      if (secondaryIndexes === undefined) {
        return undefined
      }

      const result: DynamoDB.LocalSecondaryIndexList = []

      const keys = Object.keys(secondaryIndexes)

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const value = secondaryIndexes[key]

        result.push({
          IndexName: `${key}Index`,
          KeySchema: [
            {
              AttributeName: key,
              KeyType: value
            }
          ],
          Projection: {
            ProjectionType: 'ALL'
          }
        })
      }

      return result
    }

    const getProvisionedThroughput = (prov?: DynamoProvisionedThroughput) => {
      if (!prov) {
        return undefined
      } else {
        return {
          ReadCapacityUnits: prov.readUnits,
          WriteCapacityUnits: prov.writeUnits
        }
      }
    }

    return await this.dynamo.createTable({
      TableName: configs.tableName,
      AttributeDefinitions: generateAttributeDefinitions(configs.tablePrimaryKey),
      KeySchema: generateKeySchema(configs.tablePrimaryKey),
      LocalSecondaryIndexes: generateLocalSecondaryIndexes(configs.localSecondaryIndexes),
      TableClass: configs.tableClass,
      ProvisionedThroughput: getProvisionedThroughput(configs.provisionedThroughput)
    }).promise()
  }

  public async deleteTable (tableName: string) {
    return await this.dynamo.deleteTable({
      TableName: tableName
    }).promise()
  }

  public async getAllTables () {
    let tables: string[] = []
    const params: any = {}

    while (true) {
      const response = await this.dynamo.listTables({}).promise()
      if (response.TableNames) {
        tables = tables.concat(response.TableNames)
      }

      if (undefined === response.LastEvaluatedTableName) {
        break
      } else {
        params.ExcluseStartTableName = response.LastEvaluatedTableName
      }
    }

    return tables
  }

  public async tableExists (tableName: string) {
    return (await this.getAllTables()).some(t => {
      return t.trim().toLowerCase() === tableName.trim().toLowerCase()
    })
  }

  public async insertItem (tableName: string, item: DynamoItem) {

  }
}

export default DynamoAllInOne
