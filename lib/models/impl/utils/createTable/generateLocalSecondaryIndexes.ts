import { DynamoDB } from "aws-sdk";
import { SecondaryIndexes } from "../../../../types/Table";

export default function generateLocalSecondaryIndexes(
	secondaryIndexes?: SecondaryIndexes
): DynamoDB.LocalSecondaryIndexList | undefined {
	if (!secondaryIndexes) return;

	const result: DynamoDB.LocalSecondaryIndexList = [];

	const entries = Object.entries(secondaryIndexes);
	for (const [key, value] of entries) {
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
}
