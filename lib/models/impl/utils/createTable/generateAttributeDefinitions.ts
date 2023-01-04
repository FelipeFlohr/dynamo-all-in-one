import { DynamoDB } from "aws-sdk";
import { TablePrimaryKey } from "../../../../types/Table";

export default function generateAttributeDefinitions(
	primaryKey: TablePrimaryKey
): DynamoDB.AttributeDefinitions {
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
}
