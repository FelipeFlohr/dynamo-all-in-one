import { DynamoDB, AWSError } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import { CreateTableConfigs } from "../types/Table";
import { DynamoRealItem, QueryItemsConfig } from "../types/Item";

export interface IDynamoAllInOne {
	createTable(
		configs: CreateTableConfigs
	): Promise<PromiseResult<DynamoDB.CreateTableOutput, AWSError>>;
	deleteTable(
		tableName: string
	): Promise<PromiseResult<DynamoDB.DeleteTableOutput, AWSError>>;
	getAllTables(): Promise<string[]>;
	tableExists(tableName: string): Promise<boolean>;
	insertItem(tableName: string, item: DynamoRealItem): Promise<void>;
	insertItems(
		tableName: string,
		items: DynamoRealItem[],
		parallel: boolean
	): Promise<void>;
	deleteItem(
		tableName: string,
		item: DynamoRealItem
	): Promise<PromiseResult<DynamoDB.DeleteItemOutput, AWSError>>;
	queryItems(
		configs: QueryItemsConfig
	): Promise<Array<Record<string, unknown>>>;
}
