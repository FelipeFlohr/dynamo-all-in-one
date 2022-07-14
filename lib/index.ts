/* eslint-disable no-case-declarations */
import { DynamoDB } from "aws-sdk";
import _ from "lodash";
import DynamoBinary from "./models/DynamoBinary";
import { DynamoAuthConfigs } from "./types/Auth";
import { DynamoDataTypes } from "./types/DynamoDataTypes";
import {
	DynamoRealItem,
	DynamoPrimaryKey,
	DynamoQueryAttribute,
	DynamoQueryPartitionKey,
	DynamoQuerySortKey,
	QueryItemsConfig,
	DynamoItem,
} from "./types/Item";
import {
	CreateTableConfigs,
	DynamoProvisionedThroughput,
	SecondaryIndexes,
	TablePrimaryKey,
} from "./types/Table";
import {
	handleValueToDynamo,
	objectToDynamo,
	realToDynamo,
	toDynamoCondition,
} from "./utils/realToDynamoTypes";

export default class DynamoAllInOne {
	public readonly dynamo: DynamoDB;
	private readonly configs: DynamoAuthConfigs;

	public constructor(configs: DynamoAuthConfigs) {
		this.configs = configs;
		this.dynamo = new DynamoDB({
			credentials: {
				accessKeyId: configs.accessKeyId,
				secretAccessKey: configs.secretKeyId,
			},
			region: configs.region,
			endpoint: configs.endpoint,
		});
	}

	public async createTable(configs: CreateTableConfigs) {
		const generateKeySchema = (
			primaryKey: TablePrimaryKey
		): DynamoDB.KeySchema => {
			const result = [
				{
					AttributeName: primaryKey.partitionKey.partitionKeyName,
					KeyType: "HASH",
				},
			];

			if (primaryKey.sortKey) {
				result.push({
					AttributeName: primaryKey.sortKey.sortKeyName,
					KeyType: "RANGE",
				});
			}

			return result;
		};

		const generateAttributeDefinitions = (
			primaryKey: TablePrimaryKey
		): DynamoDB.AttributeDefinitions => {
			const result = [
				{
					AttributeName: primaryKey.partitionKey.partitionKeyName,
					AttributeType: primaryKey.partitionKey.partitionKeyType,
				},
			];
			if (primaryKey.sortKey) {
				result.push({
					AttributeName: primaryKey.sortKey.sortKeyName,
					AttributeType: primaryKey.sortKey.sortKeyType,
				});
			}

			return result;
		};

		const generateLocalSecondaryIndexes = (
			secondaryIndexes?: SecondaryIndexes
		): DynamoDB.LocalSecondaryIndexList | undefined => {
			if (secondaryIndexes === undefined) {
				return undefined;
			}

			const result: DynamoDB.LocalSecondaryIndexList = [];

			const keys = Object.keys(secondaryIndexes);

			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				const value = secondaryIndexes[key];

				result.push({
					IndexName: `${key}Index`,
					KeySchema: [
						{
							AttributeName: key,
							KeyType: value,
						},
					],
					Projection: {
						ProjectionType: "ALL",
					},
				});
			}

			return result;
		};

		const getProvisionedThroughput = (prov?: DynamoProvisionedThroughput) => {
			if (!prov) {
				return undefined;
			} else {
				return {
					ReadCapacityUnits: prov.readUnits,
					WriteCapacityUnits: prov.writeUnits,
				};
			}
		};

		return await this.dynamo
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
				ProvisionedThroughput: getProvisionedThroughput(
					configs.provisionedThroughput
				),
			})
			.promise();
	}

	public async deleteTable(tableName: string) {
		return await this.dynamo
			.deleteTable({
				TableName: tableName,
			})
			.promise();
	}

	public async getAllTables() {
		let tables: string[] = [];
		const params: any = {};

		// eslint-disable-next-line no-constant-condition
		while (true) {
			const response = await this.dynamo.listTables({}).promise();
			if (response.TableNames) {
				tables = tables.concat(response.TableNames);
			}

			if (undefined === response.LastEvaluatedTableName) {
				break;
			} else {
				params.ExcluseStartTableName = response.LastEvaluatedTableName;
			}
		}

		return tables;
	}

	public async tableExists(tableName: string) {
		return (await this.getAllTables()).some((t) => {
			return t.trim().toLowerCase() === tableName.trim().toLowerCase();
		});
	}

	public async insertItem(tableName: string, item: DynamoRealItem) {
		const itemObj = objectToDynamo(item);
		await this.dynamo
			.putItem({
				TableName: tableName,
				Item: itemObj,
			})
			.promise();
	}

	public async insertItems(tableName: string, ...items: DynamoRealItem[]) {
		for (const item of items) {
			await this.insertItem(tableName, item);
		}
	}

	public async deleteItem(tableName: string, item: DynamoRealItem) {
		const itemObj = objectToDynamo(item);
		return await this.dynamo
			.deleteItem({
				Key: itemObj,
				TableName: tableName,
			})
			.promise();
	}

	public generatePrimaryKeyExpression(
		pk: DynamoQueryPartitionKey,
		sk?: DynamoQuerySortKey
	) {
		const skValue = sk?.value;

		let exp = `${pk.keyName} = :pk`;
		if (skValue) {
			exp = exp + ` AND ${sk.keyName} = :sk`;
		}

		return exp;
	}

	public generateFilterExpression(filters?: DynamoQueryAttribute[]) {
		if (!filters) {
			return undefined;
		}

		return filters
			.map((f, i) => {
				if (f.operation === "BETWEEN") {
					return `${f.keyName} BETWEEN :${i}B1 AND :${i}B2`;
				} else if (f.operation === "STARTSWITH") {
					return `begins_with (${f.keyName}, :${i})`;
				} else {
					return `${f.keyName} ${toDynamoCondition(f.operation)} :${i}`;
				}
			})
			.reduce((prev, curr) => {
				return prev + ` AND ${curr}`;
			});
	}

	public generateValues(
		pk: DynamoPrimaryKey,
		filters?: DynamoQueryAttribute[]
	) {
		const pkObj = {
			":pk": {
				[realToDynamo(pk.partitionKey.value)]: handleValueToDynamo(
					pk.partitionKey.value
				),
			},
		};
		const skObj =
			pk.sortKey !== undefined
				? {
						":sk": {
							[realToDynamo(pk.sortKey.value)]: handleValueToDynamo(
								pk.sortKey.value
							),
						},
				  }
				: undefined;

		const filtersMapped = filters
			?.map((f, i) => {
				if (f.operation === "BETWEEN") {
					if (f.values === undefined || f.values.length < 2) {
						throw new Error(
							"GENERATE_VALUES_ERROR: Two values not found in BETWEEN operation"
						);
					}

					return {
						[`:${i}B1`]: {
							[realToDynamo(f.values[0])]: handleValueToDynamo(f.values[0]),
						},
						[`:${i}B2`]: {
							[realToDynamo(f.values[1])]: handleValueToDynamo(f.values[1]),
						},
					};
				} else {
					return {
						[`:${i}`]: {
							[realToDynamo(f.value)]: handleValueToDynamo(f.value),
						},
					};
				}
			})
			.reduce((prev, curr) => {
				return _.merge(prev, curr);
			});

		return [pkObj, skObj, filtersMapped]
			.filter((v) => v !== undefined)
			.reduce((prev, curr) => _.merge(prev, curr));
	}

	public async queryItems(configs: QueryItemsConfig) {
		const res = await this.dynamo
			.query({
				TableName: configs.tableName,
				KeyConditionExpression: this.generatePrimaryKeyExpression(
					configs.primaryKey.partitionKey,
					configs.primaryKey.sortKey
				),
				FilterExpression: this.generateFilterExpression(configs.filters),
				ExpressionAttributeValues: this.generateValues(
					configs.primaryKey,
					configs.filters
				),
			})
			.promise();

		return res.Items?.map((v) => this.convertToRealType(v as any)) as any[];
	}

	private convertToRealType(item?: DynamoItem): DynamoRealItem | undefined {
		if (item === undefined) {
			return undefined;
		}

		return _.mapValues(item, (v, k) => {
			const type = Object.entries(v)[0][0] as DynamoDataTypes;
			const value = Object.entries(v)[0][1] as
				| string
				| number
				| null
				| undefined
				| boolean
				| any[];

			switch (type) {
				case "B":
					return new DynamoBinary(DynamoBinary.decodeValue(value as string));
				case "BOOL":
					return value === true || value === "true";
				case "BS":
					return (value as string[]).map(
						(v) => new DynamoBinary(DynamoBinary.decodeValue(v))
					);
				case "L":
					return value;
				case "M":
					return value;
				case "NS":
					return new Set<number>(value as number[]);
				case "NULL":
					return true;
				case "S":
					return `${value}`;
				case "SS":
					return new Set<string>(value as string[]);
				case "N":
					return parseFloat(value as string);
			}
		});
	}
}
