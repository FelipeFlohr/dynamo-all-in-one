import DynamoBinary from '../models/DynamoBinary'
import { DynamoRealTypes } from './RealDataTypes'

/**
 * Represents a DynamoDB item
 */
export type DynamoItem = {
    [key: string]: DynamoRealTypes
}

export type DynamoMapItem = {
    [key: string]: any
}

export type DynamoItemsRealTypes = null | string | number | DynamoMapItem | any[] | boolean

export type DynamoConditions = '==' | '!=' | '<=' | '<' | '>=' | '>' | 'BETWEEN' | 'STARTSWITH'

export type DynamoQueryAttribute = {
    keyName: string
    operation: DynamoConditions
    value?: string | number | boolean | DynamoBinary
    values?: string[] | number[] | DynamoBinary[]
}

export type DynamoQueryPartitionKey = {
    keyName: string
    value: string | number | DynamoBinary
}

export type DynamoQuerySortKey = {
    keyName: string
    value: string | number | DynamoBinary
}

export type DynamoPrimaryKey = {
    partitionKey: DynamoQueryPartitionKey
    sortKey?: DynamoQuerySortKey
}

export type QueryItemsConfig = {
    tableName: string,
    keyName?: string
    primaryKey: DynamoPrimaryKey
    filters?: DynamoQueryAttribute[]
}
