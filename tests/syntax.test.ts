import DynamoAllInOne from "../lib";
import { auth } from "./dynamoLocalAccess.json";

// eslint-disable-next-line no-unused-vars
const dynamo = new DynamoAllInOne({
	accessKeyId: auth.accessKey,
	region: auth.region,
	secretKeyId: auth.secretKey,
	endpoint: auth.endpoint,
});

test("Item is being created and read", async () => {
	if (await dynamo.tableExists("TableSyntax1")) {
		await dynamo.deleteTable("TableSyntax1");
	}

	await dynamo.createTable({
		tableName: "TableSyntax1",
		tablePrimaryKey: {
			partitionKey: {
				partitionKeyName: "client",
				partitionKeyType: "S",
			},
		},
		provisionedThroughput: {
			readUnits: 2,
			writeUnits: 2,
		},
	});

	await dynamo.insertItem("TableSyntax1", {
		client: "database01",
		name: "John Doe",
		age: 20,
		alive: true,
	});

	// eslint-disable-next-line no-unused-vars
	const res = await dynamo.dynamo
		.query({
			TableName: "TableSyntax1",
			KeyConditionExpression: "client = :pk",
			ExpressionAttributeValues: {
				":pk": {
					S: "database01",
				},
			},
		})
		.promise();

	await dynamo.deleteTable("TableSyntax1");
});
