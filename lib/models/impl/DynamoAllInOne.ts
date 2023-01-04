/* eslint-disable @typescript-eslint/no-explicit-any */
import { AWSError } from "aws-sdk";
import DynamoDB, {
	CreateTableOutput,
	DeleteItemOutput,
	DeleteTableOutput,
} from "aws-sdk/clients/dynamodb";
import { PromiseResult } from "aws-sdk/lib/request";
import { DynamoRealItem, QueryItemsConfig } from "../../types/Item";
import { CreateTableConfigs } from "../../types/Table";
import { IDynamoAllInOne } from "../IDynamoAllInOne";
import { DynamoAuthConfigs } from "../../types/Auth";
import generateAttributeDefinitions from "./utils/createTable/generateAttributeDefinitions";
import generateKeySchema from "./utils/createTable/generateKeySchema";
import generateLocalSecondaryIndexes from "./utils/createTable/generateLocalSecondaryIndexes";
import generateProvisionedThroughput from "./utils/createTable/generateProvisionedThroughput";
import { objectToDynamo } from "../../utils/realToDynamoTypes";
import generatePrimaryKeyExpression from "./utils/queryItems/generatePrimaryKeyExpression";
import generateFilterExpression from "./utils/queryItems/generateFilterExpression";
import generateValues from "./utils/queryItems/generateValues";
import convertToRealType from "./utils/queryItems/convertToRealType";

export default class DynamoAllInOne implements IDynamoAllInOne {
	public readonly dynamo: DynamoDB;

	public constructor(configs: DynamoAuthConfigs) {
		this.dynamo = new DynamoDB({
			credentials: {
				accessKeyId: configs.accessKeyId,
				secretAccessKey: configs.accessKeyId,
			},
			region: configs.region,
			endpoint: configs.endpoint,
			apiVersion: "latest",
		});
	}

	public async createTable(
		configs: CreateTableConfigs
	): Promise<PromiseResult<CreateTableOutput, AWSError>> {
		const result = await this.dynamo
			.createTable({
				TableName: configs.tableName,
				AttributeDefinitions: generateAttributeDefinitions(
					configs.tablePrimaryKey
				),
				KeySchema: generateKeySchema(configs.tablePrimaryKey),
				LocalSecondaryIndexes: generateLocalSecondaryIndexes(
					configs.localSecondaryIndexes
				),
				TableClass: configs.tableClass,
				ProvisionedThroughput: generateProvisionedThroughput(
					configs.provisionedThroughput
				),
			})
			.promise();

		return result;
	}

	public async deleteTable(
		tableName: string
	): Promise<PromiseResult<DeleteTableOutput, AWSError>> {
		const result = await this.dynamo
			.deleteTable({
				TableName: tableName,
			})
			.promise();

		return result;
	}

	public async getAllTables(): Promise<string[]> {
		let tables: string[] = [];
		const params: Record<string, string> = {};

		// eslint-disable-next-line no-constant-condition
		while (true) {
			const response = await this.dynamo.listTables(params).promise();

			if (response.TableNames) {
				tables = tables.concat(response.TableNames);
			}

			if (response.LastEvaluatedTableName === undefined) {
				break;
			}

			params.ExcluseStartTableName = response.LastEvaluatedTableName;
		}

		return tables;
	}

	public async tableExists(tableName: string): Promise<boolean> {
		const allTables = await this.getAllTables();
		const tableExists = allTables.includes(tableName);
		return tableExists;
	}

	public async insertItem(
		tableName: string,
		item: DynamoRealItem
	): Promise<void> {
		const itemObj = objectToDynamo(item);
		await this.dynamo
			.putItem({
				TableName: tableName,
				Item: itemObj,
			})
			.promise();
	}

	public async insertItems(
		tableName: string,
		items: DynamoRealItem[],
		parallel = false
	): Promise<void> {
		if (parallel) {
			const insertItem = (item: DynamoRealItem) =>
				this.insertItem(tableName, item);
			const insertFunctions = items.map((i) => insertItem(i));

			await Promise.all(insertFunctions);
		} else {
			for (const item of items) {
				await this.insertItem(tableName, item);
			}
		}
	}

	public async deleteItem(
		tableName: string,
		item: DynamoRealItem
	): Promise<PromiseResult<DeleteItemOutput, AWSError>> {
		const itemObj = objectToDynamo(item);
		const result = await this.dynamo
			.deleteItem({
				Key: itemObj,
				TableName: tableName,
			})
			.promise();
		return result;
	}

	public async queryItems(
		configs: QueryItemsConfig
	): Promise<Record<string, unknown>[]> {
		const queryObj: DynamoDB.QueryInput = {
			TableName: configs.tableName,
			KeyConditionExpression: generatePrimaryKeyExpression(
				configs.primaryKey.partitionKey,
				configs.primaryKey.sortKey
			),
			FilterExpression: generateFilterExpression(configs.filters),
			ExpressionAttributeValues: generateValues(
				configs.primaryKey,
				configs.filters
			),
		};

		const awsRes = await this.dynamo.query(queryObj).promise();
		const res = awsRes.Items?.map((v) => convertToRealType(v as any)) as Record<
			string,
			unknown
		>[];
		return res;
	}
}
