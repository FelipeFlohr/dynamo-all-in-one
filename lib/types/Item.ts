import DynamoBinary from "../models/DynamoBinary";
import { DynamoDataTypes } from "./DynamoDataTypes";
import { DynamoRealTypes } from "./RealDataTypes";

/**
 * Represents a DynamoDB item
 */
export type DynamoRealItem = {
	[key: string]: DynamoRealTypes;
};

export type DynamoItemType = {
	// eslint-disable-next-line no-unused-vars
	[key in DynamoDataTypes]:
		| string
		| number
		| null
		| undefined
		| boolean
		| any[];
};

export type DynamoItem = {
	[key: string]: DynamoItemType;
};

export type DynamoMapItem = {
	[key: string]: any;
};

export type DynamoItemsRealTypes =
	| null
	| string
	| number
	| DynamoMapItem
	| any[]
	| boolean;

export type DynamoConditions =
	| "=="
	| "!="
	| "<="
	| "<"
	| ">="
	| ">"
	| "BETWEEN"
	| "STARTSWITH";

export type DynamoQueryAttribute = {
	keyName: string;
	operation: DynamoConditions;
	value?: string | number | boolean | DynamoBinary;
	values?: string[] | number[] | DynamoBinary[];
};

export type DynamoQueryPartitionKey = {
	keyName: string;
	value: string | number | DynamoBinary;
};

export type DynamoQuerySortKey = {
	keyName: string;
	value: string | number | DynamoBinary;
};

export type DynamoPrimaryKey = {
	partitionKey: DynamoQueryPartitionKey;
	sortKey?: DynamoQuerySortKey;
};

export type QueryItemsConfig = {
	tableName: string;
	keyName?: string;
	primaryKey: DynamoPrimaryKey;
	filters?: DynamoQueryAttribute[];
};
