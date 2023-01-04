export type DynamoNumberType = "N";

export type DynamoStringType = "S";

export type DynamoBooleanType = "BOOL";

export type DynamoNullType = "NULL";

export type DynamoListType = "L";

export type DynamoMapType = "M";

export type DynamoNumberSetType = "NS";

export type DynamoStringSetType = "SS";

/**
 * N = number
 * S = string
 */
export type DynamoAttributeTypes = DynamoNumberType | DynamoStringType;

export type DynamoDataTypes =
	| DynamoNumberType
	| DynamoStringType
	| DynamoBooleanType
	| DynamoNullType
	| DynamoListType
	| DynamoMapType
	| DynamoNumberSetType
	| DynamoStringSetType;
