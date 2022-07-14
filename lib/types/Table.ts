import { DynamoAttributeTypes } from "./DynamoDataTypes";

export type TablePartitionKey = {
	partitionKeyName: string;
	partitionKeyType: DynamoAttributeTypes;
};

export type TableSortKey = {
	sortKeyName: string;
	sortKeyType: DynamoAttributeTypes;
};

export type TablePrimaryKey = {
	partitionKey: TablePartitionKey;
	sortKey?: TableSortKey;
};

export type SecondaryIndexes = {
	[key: string]: DynamoAttributeTypes;
};

export type DynamoProvisionedThroughput = {
	readUnits: number;
	writeUnits: number;
};

export type CreateTableConfigs = {
	/**
	 * Name of the table.
	 */
	tableName: string;
	/**
	 * Primary key consists of a partition key and a sort key
	 * (optional).
	 */
	tablePrimaryKey: TablePrimaryKey;
	/**
	 * Defines the table class type. "Standard Infrequent
	 * Access" (a.k.a Standard IA) is recommended for tables
	 * which is infrequently accessed, with the storage
	 * being the major cost.
	 * @default 'STANDARD'
	 */
	tableClass?: "STANDARD" | "STANDARD_INFREQUENT_ACCESS";
	/**
	 * Defines the local secondary indexes. They can be used
	 * for query operations.
	 */
	localSecondaryIndexes?: SecondaryIndexes;
	provisionedThroughput?: DynamoProvisionedThroughput;
};
