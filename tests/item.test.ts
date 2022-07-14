/* eslint-disable no-undef */
import DynamoAllInOne from "../lib";
import { auth } from "./dynamoLocalAccess.json";

jest.setTimeout(60000);

// eslint-disable-next-line no-unused-vars
const dynamo = new DynamoAllInOne({
	accessKeyId: auth.accessKey,
	region: auth.region,
	secretKeyId: auth.secretKey,
	endpoint: auth.endpoint,
});

test("Item is being created", async () => {
	const tableName = "TableItem01";
	if (await dynamo.tableExists(tableName)) {
		await dynamo.deleteTable(tableName);
	}

	await dynamo.createTable({
		tableName,
		tablePrimaryKey: {
			partitionKey: {
				partitionKeyName: "client",
				partitionKeyType: "S",
			},
			sortKey: {
				sortKeyName: "id",
				sortKeyType: "N",
			},
		},
		provisionedThroughput: {
			readUnits: 100,
			writeUnits: 100,
		},
	});

	const objs: any[] = [];
	for (let i = 0; i < 50; i++) {
		objs.push({
			client: "database01",
			id: i,
			name: "John Doe",
		});
	}

	await dynamo.insertItems(tableName, ...objs);

	const query = await dynamo.queryItems({
		tableName,
		primaryKey: {
			partitionKey: {
				keyName: "client",
				value: "database01",
			},
		},
	});

	await dynamo.deleteTable(tableName);
	expect(query?.length === 50);
});
