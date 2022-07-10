export type DynamoNumberType = 'N'

export type DynamoStringType = 'S'

export type DynamoBooleanType = 'BOOL'

export type DynamoNullType = 'NULL'

export type DynamoBinaryType = 'B'

export type DynamoListType = 'L'

export type DynamoMapType = 'M'

export type DynamoNumberSetType = 'NS'

export type DynamoStringSetType = 'SS'

export type DynamoBinarySetType = 'BS'

/**
 * N = number
 * S = string
 * B = binary
 */
export type DynamoAttributeTypes = DynamoNumberType | DynamoStringType | DynamoBinaryType

export type DynamoDataTypes =
    DynamoNumberType |
    DynamoStringType |
    DynamoBooleanType |
    DynamoNullType |
    DynamoBinaryType |
    DynamoListType |
    DynamoMapType |
    DynamoNumberSetType |
    DynamoStringSetType |
    DynamoBinarySetType
