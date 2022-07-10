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
