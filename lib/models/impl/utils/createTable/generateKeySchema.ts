import { DynamoDB } from "aws-sdk";
import { TablePrimaryKey } from "../../../../types/Table";

export default function (primaryKey: TablePrimaryKey): DynamoDB.KeySchema {
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
}
